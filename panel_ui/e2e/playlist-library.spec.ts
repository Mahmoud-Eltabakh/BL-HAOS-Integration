import { expect, test, type Locator, type Page } from '@playwright/test';
import * as fs from 'node:fs';
import * as path from 'node:path';

const localOrigin = 'http://127.0.0.1:5173';
const forbiddenRequests = new WeakMap<Page, string[]>();
test.beforeEach(async ({ page }) => {
  const escaped: string[] = [];
  forbiddenRequests.set(page, escaped);
  await page.route('**/*', async (route) => {
    if (new URL(route.request().url()).origin !== localOrigin) {
      escaped.push(route.request().url());
      await route.abort();
      return;
    }
    await route.continue();
  });
});

async function openLibrary(page: Page, scenario = ''): Promise<Locator> {
  const query = new URLSearchParams();
  if (scenario) query.set('scenario', scenario);
  await page.goto(`/mock-harness.html${query.size ? `?${query}` : ''}`, { waitUntil: 'domcontentloaded' });
  const panel = page.locator('bl-haos-media-card');
  await expect(panel).toHaveCount(1);
  await expect.poll(() => panel.evaluate((element: any) => Boolean(
    element.shadowRoot && element.hass?.connection?.connected && element.hass?.user?.id,
  ))).toBe(true);
  await expect(panel.getByRole('heading', { name: 'Your playlists', exact: true })).toBeVisible();
  return panel;
}

function expectLocalOnly(page: Page) {
  expect(forbiddenRequests.get(page)).toEqual([]);
}

async function snapshot(page: Page) {
  return page.evaluate(() => (window as any).__mockLibrary.snapshot());
}

async function calls(page: Page) {
  return page.evaluate(() => (window as any).__mockLibrary.calls);
}

async function failNext(page: Page, type: string, message: string, afterCommit = false) {
  await page.evaluate(({ command, failure, commit }) => {
    (window as any).__mockLibrary.failNext(command, failure, commit);
  }, { command: type, failure: message, commit: afterCommit });
}

test('loads the local saved playlist library without playback controls', async ({ page }) => {
  const panel = await openLibrary(page, 'empty');
  await expect(panel.getByRole('button', { name: 'Create playlist' })).toBeEnabled();
  await expect(panel.getByRole('button', { name: /\b(play|queue|launch)\b/i })).toHaveCount(0);
  expect(await page.evaluate(() => (window as any).__playedCalls)).toEqual([]);
  expectLocalOnly(page);
});

test('creates distinct UUIDv4 playlists when the HTTPS-only randomUUID API is absent', async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(crypto, 'randomUUID', { configurable: true, value: undefined });
  });
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.name));
  const panel = await openLibrary(page, 'empty');
  for (const name of ['HTTP playlist one', 'HTTP playlist two']) {
    await panel.getByRole('button', { name: 'Create playlist', exact: true }).click();
    await panel.getByRole('textbox', { name: 'Playlist name' }).fill(name);
    await panel.getByRole('button', { name: 'Save playlist', exact: true }).click();
    await expect(panel.getByText(name, { exact: true })).toBeVisible();
  }
  const ids = (await snapshot(page)).records.map((record: { record_id: string }) => record.record_id);
  expect(ids).toHaveLength(2);
  expect(new Set(ids).size).toBe(2);
  for (const id of ids) expect(id).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/);
  expect(errors).toEqual([]);
  expect(await page.evaluate(() => (window as any).__playedCalls)).toEqual([]);
  expectLocalOnly(page);
});

test('queue launch confirms replacement and submits only the saved record and target', async ({ page }) => {
  const panel = await openLibrary(page, 'queue');
  const target = panel.getByRole('combobox', { name: 'Play on' });
  await expect(target).toHaveValue('');
  await target.selectOption('media_player.kitchen_speaker');
  await panel.getByRole('button', { name: 'Play playlist Quiet hours' }).click();

  const dialog = panel.getByRole('dialog', { name: 'Replace queue' });
  await expect(dialog).toContainText('Kitchen Speaker');
  await expect(dialog.getByRole('button', { name: 'Keep current queue' })).toBeFocused();
  await dialog.getByRole('button', { name: 'Replace queue' }).click();

  await expect(panel.getByText('Queue updated on Kitchen Speaker.')).toBeVisible();
  await expect(panel.getByRole('region', { name: 'Playback queue' }).getByText('Quiet hours', { exact: true })).toBeVisible();
  await expect(panel.getByText('First saved track', { exact: true })).toBeVisible();
  const launch = (await calls(page)).filter((call: any) => call.type === 'bl_haos/playlist_library/start');
  expect(launch).toEqual([{
    type: 'bl_haos/playlist_library/start',
    record_id: 'queue-custom-record',
    entity_id: 'media_player.kitchen_speaker',
  }]);
  const queue = await page.evaluate(() => (window as any).__mockQueue.snapshot());
  expect(queue['media_player.kitchen_speaker']).toMatchObject({
    status: 'playing', playlist: 'Quiet hours', title: 'First saved track', index: 1, count: 2,
  });
  expect(await page.evaluate(() => (window as any).__mockQueue.resolvedTitles)).toEqual([
    'First saved track', 'Second saved track',
  ]);
  expect(JSON.stringify(queue)).not.toContain('://');
  expect(await page.evaluate(() => (window as any).__playedCalls)).toEqual([]);
  expectLocalOnly(page);

  await page.evaluate(() => (window as any).__mockQueue.complete('media_player.kitchen_speaker', true));
  await expect(panel.getByRole('region', { name: 'Playback queue' })).toContainText('Second saved track');
  await expect(panel.getByText('Item 2 of 2')).toBeVisible();
  await page.evaluate(() => (window as any).__mockQueue.complete('media_player.kitchen_speaker', true));
  await expect(panel.getByRole('region', { name: 'Playback queue' })).toContainText('Playlist complete');
});

test('provider queue start stays atomic and resolver failure retains the existing queue', async ({ page }) => {
  const panel = await openLibrary(page, 'queue');
  await panel.getByRole('combobox', { name: 'Play on' }).selectOption('media_player.kitchen_speaker');
  const providerLaunch = panel.getByRole('list', { name: 'Saved Home Assistant playlists' })
    .getByRole('button', { name: 'Play playlist Provider mix' });
  await providerLaunch.click();
  await panel.getByRole('dialog', { name: 'Replace queue' }).getByRole('button', { name: 'Replace queue' }).click();
  await expect(panel.getByRole('region', { name: 'Playback queue' })).toContainText('Provider playlist');
  const providerQueue = await page.evaluate(() => (window as any).__mockQueue.snapshot()['media_player.kitchen_speaker']);
  expect(providerQueue.count).toBe(1);
  expect(await page.evaluate(() => (window as any).__mockQueue.resolvedTitles)).toEqual(['Provider playlist']);
  expect(JSON.stringify(providerQueue)).not.toContain('://');

  await page.reload();
  const freshPanel = await openLibrary(page, 'queue');
  await freshPanel.getByRole('combobox', { name: 'Play on' }).selectOption('media_player.kitchen_speaker');
  await failNext(page, 'mock/queue_resolve', 'https://private.invalid/resolver?token=sentinel');
  await freshPanel.getByRole('button', { name: 'Play playlist Quiet hours' }).click();
  const dialog = freshPanel.getByRole('dialog', { name: 'Replace queue' });
  await dialog.getByRole('button', { name: 'Replace queue' }).click();
  await expect(dialog.getByRole('alert')).toContainText('Couldn\'t confirm');
  await expect(dialog.getByRole('alert')).not.toContainText('private.invalid');
  await expect(dialog.getByRole('alert')).not.toContainText('sentinel');
  await expect(freshPanel.getByRole('region', { name: 'Playback queue' })).toContainText('Current queue');
  await expect(freshPanel.getByText('Keep this item')).toBeVisible();
  expect(await page.evaluate(() => (window as any).__mockQueue.snapshot()['media_player.kitchen_speaker']))
    .toMatchObject({ playlist: 'Current queue', title: 'Keep this item', index: 1, count: 2 });
  expect(await page.evaluate(() => (window as any).__mockQueue.resolvedTitles)).toEqual([]);
  expectLocalOnly(page);
});

test('mock failure stays on the item until explicit skip and disconnect clears the queue', async ({ page }) => {
  const panel = await openLibrary(page, 'queue');
  await panel.getByRole('combobox', { name: 'Play on' }).selectOption('media_player.kitchen_speaker');
  await page.evaluate(() => (window as any).__mockQueue.complete('media_player.kitchen_speaker', false));
  await expect(panel.getByRole('region', { name: 'Playback queue' })).toContainText('Nothing was skipped');
  await expect(panel.getByText('Item 1 of 2')).toBeVisible();

  await page.evaluate(() => {
    const queue = (window as any).__mockQueue;
    queue.control('media_player.kitchen_speaker', 'set_shuffle', true);
    queue.control('media_player.kitchen_speaker', 'set_repeat', 'all');
    queue.control('media_player.kitchen_speaker', 'next');
  });
  await expect(panel.getByRole('region', { name: 'Playback queue' })).toContainText('Second current item');
  await expect(panel.getByRole('region', { name: 'Playback queue' })).toContainText('Shuffle on');
  await expect(panel.getByRole('region', { name: 'Playback queue' })).toContainText('Repeat all');
  await page.evaluate(() => (window as any).__mockQueue.disconnect('media_player.kitchen_speaker'));
  await expect(panel.getByRole('region', { name: 'Playback queue' })).toContainText('Speaker disconnected. The queue was stopped.');
  expect(await page.evaluate(() => (window as any).__mockQueue.snapshot()['media_player.kitchen_speaker'])).toBeNull();
  expectLocalOnly(page);
});

test('creates, edits, keyboard-reorders, and confirms deletion without changing opaque references', async ({ page }) => {
  const panel = await openLibrary(page, 'empty');
  const firstId = 'media-source://spotify/track/sunset-1';
  const secondId = 'media-source://spotify/track/glow-2';

  await panel.getByRole('button', { name: 'Create playlist' }).click();
  await panel.getByRole('textbox', { name: 'Playlist name' }).fill('Quiet hours');
  await panel.getByRole('button', { name: 'Save playlist' }).click();
  await expect(panel.getByText('Quiet hours', { exact: true })).toBeVisible();
  const created = await snapshot(page);
  const record = created.records.find((item: any) => item.kind === 'custom');
  expect(record.record_id).toMatch(/^[0-9a-f-]{36}$/i);
  expect(record.entries).toEqual([]);

  await panel.getByRole('button', { name: 'Edit playlist' }).click();
  await panel.getByRole('button', { name: 'Add media' }).click();
  await panel.getByRole('button', { name: 'Open Spotify Provider' }).click();
  await panel.getByRole('button', { name: 'Open Chill Evening Beats' }).click();
  await panel.getByRole('button', { name: 'Add media Sunset Horizon' }).click();
  await panel.getByRole('button', { name: 'Add media' }).click();
  await panel.getByRole('button', { name: 'Add media Night Glow' }).click();
  await panel.getByRole('button', { name: 'Add media' }).click();
  await panel.getByRole('button', { name: 'Add media Sunset Horizon' }).click();
  await expect(panel.getByRole('list', { name: 'Playlist entries' }).getByRole('listitem')).toHaveCount(3);
  await expect(panel.getByRole('button', { name: 'Play playlist Quiet hours' })).toBeVisible();

  await panel.getByRole('textbox', { name: 'Playlist name' }).fill('Late drive');
  const entries = panel.getByRole('list', { name: 'Playlist entries' });
  const firstMoveDown = entries.getByRole('button', { name: 'Move entry down' }).nth(0);
  await firstMoveDown.focus();
  await page.keyboard.press('Enter');
  await expect(panel.getByRole('status')).toHaveText('Moved Sunset Horizon to position 2 of 3.');
  await expect(entries.getByRole('listitem').nth(1).getByRole('button', { name: 'Move entry down' })).toBeFocused();

  const lastMoveUp = entries.getByRole('button', { name: 'Move entry up' }).nth(2);
  await lastMoveUp.focus();
  await page.keyboard.press('Enter');
  await expect(panel.getByRole('status')).toHaveText('Moved Sunset Horizon to position 2 of 3.');
  await expect(entries.getByRole('listitem').nth(1).getByRole('button', { name: 'Move entry up' })).toBeFocused();

  await panel.getByRole('button', { name: 'Save changes' }).click();
  await expect(panel.getByText('Late drive', { exact: true })).toBeVisible();
  const edited = await snapshot(page);
  const updated = edited.records.find((item: any) => item.record_id === record.record_id);
  expect(updated.name).toBe('Late drive');
  expect(updated.entries.map((entry: any) => entry.media_content_id)).toEqual([secondId, firstId, firstId]);

  const deleteTrigger = panel.getByRole('button', { name: 'Delete playlist' });
  await deleteTrigger.click();
  const dialog = panel.getByRole('dialog', { name: 'Delete playlist: Late drive' });
  await expect(dialog.getByRole('button', { name: 'Keep playlist' })).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(dialog).toHaveCount(0);
  await expect(deleteTrigger).toBeFocused();

  await deleteTrigger.click();
  const confirm = panel.getByRole('dialog', { name: 'Delete playlist: Late drive' });
  await confirm.getByRole('button', { name: 'Delete playlist' }).click();
  await expect(panel.getByRole('button', { name: 'Create playlist' })).toBeFocused();
  expect((await snapshot(page)).records).toEqual([]);
  expect(await page.evaluate(() => (window as any).__playedCalls)).toEqual([]);
  expectLocalOnly(page);
});

test('saves one provider reference idempotently, renames it, and removes only the local shortcut', async ({ page }) => {
  const panel = await openLibrary(page, 'empty');
  const providerId = 'media-source://spotify/playlist/chill-evening';
  await panel.getByRole('navigation', { name: 'Media views' }).getByRole('button', { name: 'Browse media' }).click();
  await panel.getByRole('button', { name: 'Open Spotify Provider' }).click();
  await panel.getByRole('button', { name: 'Save to library Chill Evening Beats' }).click();
  await panel.getByRole('textbox', { name: 'Shortcut name' }).fill('My evening set');
  await failNext(page, 'bl_haos/playlist_library/save_provider', 'temporary acknowledgment loss', true);
  await panel.getByRole('button', { name: 'Save shortcut' }).click();
  await expect(panel.getByRole('alert')).toContainText('Nothing was added.');
  expect((await snapshot(page)).revision).toBe(1);
  expect((await snapshot(page)).records[0]).toMatchObject({ name: 'My evening set', media_content_id: providerId });
  await panel.getByRole('textbox', { name: 'Shortcut name' }).fill('Ignored retry label');
  await panel.getByRole('button', { name: 'Save shortcut' }).click();
  const savedProviderAction = panel.getByRole('button', { name: 'Save to library Chill Evening Beats' });
  await expect(savedProviderAction).toHaveText('Saved to library');

  await panel.getByRole('button', { name: 'Library', exact: true }).click();
  await expect(panel.getByText('My evening set', { exact: true })).toBeVisible();
  const saved = await snapshot(page);
  expect(saved.revision).toBe(1);
  expect(saved.records).toHaveLength(1);
  expect(saved.records[0]).toMatchObject({ kind: 'provider', name: 'My evening set', media_content_id: providerId });
  expect(saved.records[0]).not.toHaveProperty('entries');

  await panel.getByRole('button', { name: 'Rename shortcut' }).click();
  await panel.getByRole('textbox', { name: 'Shortcut name' }).fill('Renamed local set');
  await panel.getByRole('button', { name: 'Save shortcut name' }).click();
  await expect(panel.getByText('Renamed local set', { exact: true })).toBeVisible();
  expect((await snapshot(page)).revision).toBe(2);
  await panel.getByRole('button', { name: 'Remove shortcut' }).click();
  const dialog = panel.getByRole('dialog', { name: 'Remove shortcut: Renamed local set' });
  await expect(dialog).toContainText('The Home Assistant playlist itself will not be changed.');
  await expect(dialog.getByRole('button', { name: 'Keep shortcut' })).toBeFocused();
  await dialog.getByRole('button', { name: 'Remove shortcut' }).click();
  await expect(panel.getByText('Renamed local set', { exact: true })).toHaveCount(0);
  await expect(panel.getByRole('navigation', { name: 'Media views' }).getByRole('button', { name: 'Browse media' })).toBeFocused();
  expect((await snapshot(page)).records).toEqual([]);
  expect((await snapshot(page)).revision).toBe(3);

  await panel.getByRole('navigation', { name: 'Media views' }).getByRole('button', { name: 'Browse media' }).click();
  await expect(panel.getByRole('heading', { name: 'Spotify Provider', exact: true })).toBeVisible();
  expect((await snapshot(page)).records).toEqual([]);
  expect(await page.evaluate(() => (window as any).__playedCalls)).toEqual([]);
  const providerSaves = (await calls(page)).filter((call: any) => call.type === 'bl_haos/playlist_library/save_provider');
  expect(providerSaves.map((call: any) => call.media_content_id)).toEqual([providerId, providerId]);
  expectLocalOnly(page);
});

test('checks availability manually by exact reference and retains order when browse fails', async ({ page }) => {
  const panel = await openLibrary(page, 'availability');
  const initial = await snapshot(page);
  expect((await calls(page)).map((call: any) => call.type)).toEqual(['bl_haos/playlist_library/list']);
  await expect(panel.getByText('Not checked').first()).toBeVisible();

  const provider = panel.getByRole('list', { name: 'Saved Home Assistant playlists' }).getByRole('button', { name: 'Check availability' });
  await provider.click();
  await expect(panel.getByText('Available in Home Assistant', { exact: true })).toBeVisible();
  await panel.getByRole('button', { name: 'Edit playlist' }).click();
  await failNext(page, 'media_source/browse_media', 'provider denied this reference');
  await panel.getByRole('button', { name: 'Check availability' }).first().click();
  await expect(panel.getByRole('list', { name: 'Playlist entries' }).getByText('Unavailable in Home Assistant.', { exact: true })).toBeVisible();

  expect((await calls(page)).filter((call: any) => call.type === 'media_source/browse_media')
    .map((call: any) => call.media_content_id)).toEqual([
    'media-source://spotify/playlist/chill-evening',
    'media-source://spotify/track/sunset-1',
  ]);
  expect((await snapshot(page)).records).toEqual(initial.records);
  expect(await page.evaluate(() => (window as any).__playedCalls)).toEqual([]);
  expect((await calls(page)).map((call: any) => call.type)).toEqual([
    'bl_haos/playlist_library/list',
    'media_source/browse_media',
    'media_source/browse_media',
  ]);
  expectLocalOnly(page);
});

test('preserves create drafts and stable IDs across validation and transient failures', async ({ page }) => {
  const panel = await openLibrary(page, 'empty');
  await panel.getByRole('button', { name: 'Create playlist' }).click();
  await panel.getByRole('textbox', { name: 'Playlist name' }).fill('Retry-safe draft');
  await panel.getByRole('button', { name: 'Add media' }).click();
  await panel.getByRole('button', { name: 'Open Spotify Provider' }).click();
  await panel.getByRole('button', { name: 'Open Chill Evening Beats' }).click();
  await panel.getByRole('button', { name: 'Add media Sunset Horizon' }).click();
  await failNext(page, 'bl_haos/playlist_library/save_custom', 'Invalid playlist record');
  await panel.getByRole('button', { name: 'Save playlist' }).click();
  await expect(panel.getByRole('alert')).toContainText('Your valid draft data is still here.');
  await expect(panel.getByRole('textbox', { name: 'Playlist name' })).toHaveValue('Retry-safe draft');
  await expect(panel.getByRole('list', { name: 'Playlist entries' })).toContainText('Sunset Horizon');
  expect((await snapshot(page)).records).toEqual([]);

  await failNext(page, 'bl_haos/playlist_library/save_custom', 'temporary storage failure');
  await panel.getByRole('button', { name: 'Save playlist' }).click();
  await expect(panel.getByRole('alert')).toContainText('Your draft is still here.');
  await expect(panel.getByRole('textbox', { name: 'Playlist name' })).toHaveValue('Retry-safe draft');
  await panel.getByRole('button', { name: 'Save playlist' }).click();
  await expect(panel.getByText('Retry-safe draft', { exact: true })).toBeVisible();

  const customSaves = (await calls(page)).filter((call: any) => call.type === 'bl_haos/playlist_library/save_custom');
  expect(customSaves).toHaveLength(3);
  expect(customSaves.map((call: any) => call.record_id)).toEqual([
    customSaves[0].record_id, customSaves[0].record_id, customSaves[0].record_id,
  ]);
  expect((await snapshot(page)).records[0].entries[0].media_content_id)
    .toBe('media-source://spotify/track/sunset-1');
  expectLocalOnly(page);
});

test('keeps stale drafts, newer records, and failed confirmation context', async ({ page }) => {
  const panel = await openLibrary(page, 'availability');
  const original = (await snapshot(page)).records[0];
  await panel.getByRole('button', { name: 'Edit playlist' }).click();
  await panel.getByRole('textbox', { name: 'Playlist name' }).fill('Unsaved local draft');
  await page.evaluate(({ recordId }) => {
    (window as any).__mockLibrary.replaceRecord(recordId, { name: 'Newer saved record' });
  }, { recordId: original.record_id });
  await panel.getByRole('button', { name: 'Save changes' }).click();
  await expect(panel.getByRole('alert')).toContainText('The newer saved version was kept');
  await expect(panel.getByRole('textbox', { name: 'Playlist name' })).toHaveValue('Unsaved local draft');
  await expect(panel.getByText('Newer saved record', { exact: true })).toBeVisible();
  await panel.getByRole('button', { name: 'Stop editing' }).click();
  await panel.getByRole('dialog', { name: 'Discard changes' }).getByRole('button', { name: 'Discard changes' }).click();

  await panel.getByRole('button', { name: 'Delete playlist' }).click();
  const dialog = panel.getByRole('dialog', { name: 'Delete playlist: Newer saved record' });
  await failNext(page, 'bl_haos/playlist_library/delete_custom', 'temporary delete failure');
  await dialog.getByRole('button', { name: 'Delete playlist' }).click();
  await expect(dialog.getByRole('alert')).toContainText('It remains in your library.');
  await expect(dialog).toBeVisible();
  await expect(panel.getByText('Newer saved record', { exact: true })).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(dialog).toHaveCount(0);
  expect((await snapshot(page)).records[0].name).toBe('Newer saved record');
  expect(await page.evaluate(() => (window as any).__playedCalls)).toEqual([]);
  expectLocalOnly(page);
});

for (const width of [375, 768, 1440]) {
  test(`covers all ten rendered mock backstops at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    const panel = await openLibrary(page, 'responsive');

    const libraryBody = panel.locator('.library-body');
    const libraryScrolls = await libraryBody.evaluate((node) => node.scrollHeight > node.clientHeight);
    expect(libraryScrolls).toBe(false);
    const lastCustom = panel.getByRole('list', { name: 'Your playlists' }).getByRole('listitem').last();
    await lastCustom.scrollIntoViewIfNeeded();
    await expect(lastCustom.getByRole('button', { name: 'Edit playlist' })).toBeVisible();

    const longName = 'Long playlist label '.repeat(6).trim().slice(0, 128);
    const longTitle = 'Long media title '.repeat(15).trim().slice(0, 200);
    await expect(panel.getByText(longName, { exact: true }).first()).toBeVisible();
    await expect(panel.getByText(longName, { exact: true }).last()).toBeVisible();

    const edit = panel.getByRole('list', { name: 'Your playlists' }).getByRole('listitem').first();
    await edit.getByRole('button', { name: 'Edit playlist' }).click();
    const entryList = panel.getByRole('list', { name: 'Playlist entries' });
    expect(await entryList.evaluate((node) => node.scrollHeight > node.clientHeight)).toBe(true);
    const lastEntry = entryList.getByRole('listitem').last();
    await lastEntry.scrollIntoViewIfNeeded();
    await expect(lastEntry.getByRole('button', { name: /^Remove / })).toBeVisible();
    await expect(panel.getByRole('button', { name: 'Save changes' })).toBeVisible();
    await expect(panel.getByRole('textbox', { name: 'Playlist name' })).toHaveValue(longName);
    await expect(entryList.getByText(longTitle, { exact: true })).toBeVisible();

    await panel.getByRole('button', { name: 'Add media' }).click();
    await expect(panel.getByRole('heading', { name: 'Media Catalog', exact: true })).toBeVisible();
    const catalogBody = panel.locator('.catalog-body');
    const longPickerTitle = panel.getByText(longTitle, { exact: true });
    await expect(longPickerTitle.last()).toBeVisible();
    const catalogOverflows = await catalogBody.evaluate((node) => node.scrollHeight > node.clientHeight)
      || await panel.locator('main').evaluate((node) => node.scrollHeight > node.clientHeight);
    expect(catalogOverflows).toBe(false);
    await longPickerTitle.last().scrollIntoViewIfNeeded();
    await expect(panel.getByRole('button', { name: `Add media ${longTitle}`, exact: true })).toBeVisible();

    await panel.getByRole('button', { name: 'Library', exact: true }).click();
    await panel.getByRole('button', { name: 'Stop editing' }).click();
    const providerBody = panel.locator('.provider-library-body');
    expect(await providerBody.evaluate((node) => node.scrollHeight > node.clientHeight)).toBe(false);
    const lastProvider = panel.getByRole('list', { name: 'Saved Home Assistant playlists' }).getByRole('listitem').last();
    await lastProvider.scrollIntoViewIfNeeded();
    const providerTitle = lastProvider.locator('.provider-title');
    await expect(providerTitle).toBeVisible();
    const providerTitleStyle = await providerTitle.evaluate((node) => ({
      display: getComputedStyle(node).display,
      overflow: getComputedStyle(node).overflow,
      overflowWrap: getComputedStyle(node).overflowWrap,
      lineClamp: getComputedStyle(node).webkitLineClamp,
    }));
    expect(providerTitleStyle).toEqual({ display: 'block', overflow: 'visible', overflowWrap: 'anywhere', lineClamp: 'none' });
    await expect(lastProvider.getByRole('button', { name: 'Check availability' })).toBeVisible();
    await lastProvider.getByRole('button', { name: 'Check availability' }).click();
    await expect(lastProvider.getByText('Available in Home Assistant')).toBeVisible();
    await expect(lastProvider.getByText(longName, { exact: true })).toBeVisible();
    const metadataBelowTitle = await lastProvider.evaluate((node) => {
      const title = node.querySelector<HTMLElement>('.provider-title')!.getBoundingClientRect();
      return [...node.querySelectorAll<HTMLElement>('.metadata')]
        .every((metadata) => metadata.getBoundingClientRect().top >= title.bottom - 1);
    });
    expect(metadataBelowTitle).toBe(true);

    await panel.getByRole('button', { name: 'Delete playlist' }).first().scrollIntoViewIfNeeded();
    await panel.getByRole('button', { name: 'Delete playlist' }).first().click();
    const dialog = panel.getByRole('dialog', { name: `Delete playlist: ${longName}` });
    await page.setViewportSize({ width, height: 280 });
    const dialogMetrics = await dialog.evaluate((node) => ({
      scrollable: getComputedStyle(node).overflowY === 'auto',
      hasVerticalOverflow: node.scrollHeight > node.clientHeight,
      noHorizontalOverflow: node.scrollWidth <= node.clientWidth + 2,
      targetsAtLeast44px: [...node.querySelectorAll<HTMLElement>('button')].every((button) => {
        const rect = button.getBoundingClientRect();
        return rect.width >= 44 && rect.height >= 44;
      }),
    }));
    expect(dialogMetrics.scrollable).toBe(true);
    expect(dialogMetrics.hasVerticalOverflow).toBe(width === 375);
    expect(dialogMetrics.noHorizontalOverflow).toBe(true);
    expect(dialogMetrics.targetsAtLeast44px).toBe(true);
    await dialog.evaluate((node) => { node.scrollTop = node.scrollHeight; });
    await expect(dialog.getByRole('button', { name: 'Keep playlist' })).toBeVisible();
    await expect(dialog.getByRole('button', { name: 'Delete playlist' })).toBeVisible();
    await failNext(page, 'bl_haos/playlist_library/delete_custom', 'partial failure retained');
    await dialog.getByRole('button', { name: 'Delete playlist' }).click();
    await expect(dialog.getByRole('alert')).toContainText('It remains in your library.');
    await expect(panel.getByText(longName, { exact: true }).first()).toBeVisible();
    await page.keyboard.press('Escape');

    const layout = await panel.evaluate((element) => {
      const shadow = element.shadowRoot!;
      const main = shadow.querySelector<HTMLElement>('main')!;
      const dialogElement = shadow.querySelector<HTMLElement>('dialog[open]');
      const scope = dialogElement ?? main;
      const controls = [...scope.querySelectorAll<HTMLElement>('button,input,select,a')].filter((control) => {
        const rect = control.getBoundingClientRect();
        if (!control.getClientRects().length || rect.width <= 0 || rect.height <= 0
          || rect.right <= 0 || rect.left >= innerWidth || rect.bottom <= 0 || rect.top >= innerHeight) return false;
        let parent = control.parentElement;
        while (parent && parent !== main) {
          const style = getComputedStyle(parent);
          const bounds = parent.getBoundingClientRect();
          if ((/(auto|scroll|hidden)/.test(style.overflowX) && (rect.right <= bounds.left || rect.left >= bounds.right))
            || (/(auto|scroll|hidden)/.test(style.overflowY) && (rect.bottom <= bounds.top || rect.top >= bounds.bottom))) return false;
          parent = parent.parentElement;
        }
        return true;
      });
      const rects = controls.map((control) => control.getBoundingClientRect());
      const overlap = rects.some((first, index) => rects.slice(index + 1).some((second) =>
        Math.min(first.right, second.right) - Math.max(first.left, second.left) > 2
        && Math.min(first.bottom, second.bottom) - Math.max(first.top, second.top) > 2));
      const scrollRegions = [...shadow.querySelectorAll<HTMLElement>(
        '.library-body,.provider-library-body,.playlist-entries,.catalog-body,.confirmation-dialog',
      )];
      return {
        noHorizontalOverflow: main.scrollWidth <= main.clientWidth + 2
          && document.documentElement.scrollWidth <= document.documentElement.clientWidth + 2
          && scrollRegions.every((region) => region.scrollWidth <= region.clientWidth + 2),
        targetsAtLeast44px: controls.every((control) => {
          const rect = control.getBoundingClientRect();
          return rect.width >= 44 && rect.height >= 44;
        }),
        noControlOverlap: !overlap,
        controlsHaveNames: controls.every((control) => Boolean(
          control.getAttribute('aria-label') || control.textContent?.trim() || control.labels?.length,
        )),
        hasPoliteAnnouncement: Boolean(shadow.querySelector('[role="status"][aria-live="polite"][aria-atomic="true"]')),
      };
    });
    expect(layout.noHorizontalOverflow).toBe(true);
    expect(layout.targetsAtLeast44px).toBe(true);
    expect(layout.noControlOverlap).toBe(true);
    expect(layout.controlsHaveNames).toBe(true);
    expect(layout.hasPoliteAnnouncement).toBe(true);

    await page.setViewportSize({ width, height: 900 });
    if (process.env.BLHAOS_NO_SCREENSHOTS !== '1') {
      const screenshotDir = path.resolve(process.cwd(), 'test-results', 'playlist-library');
      fs.mkdirSync(screenshotDir, { recursive: true });
      await page.screenshot({ path: path.join(screenshotDir, `playlist-library-${width}px.png`), fullPage: true });
    }
    expect(await page.evaluate(() => (window as any).__playedCalls)).toEqual([]);
    expectLocalOnly(page);
  });
}

for (const width of [375, 768, 1440]) {
  test(`renders the empty library without overflow at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    const panel = await openLibrary(page, 'empty');
    await expect(panel.getByRole('heading', { name: 'Your library is empty' })).toBeVisible();
    await expect(panel.getByRole('button', { name: 'Create playlist' })).toBeEnabled();

    const layout = await panel.evaluate((element) => {
      const shadow = element.shadowRoot!;
      const main = shadow.querySelector<HTMLElement>('main')!;
      const controls = [...main.querySelectorAll<HTMLElement>('button,input,select,a')]
        .filter((control) => control.getClientRects().length > 0);
      return {
        noHorizontalOverflow: main.scrollWidth <= main.clientWidth + 2
          && document.documentElement.scrollWidth <= document.documentElement.clientWidth + 2,
        targetsAtLeast44px: controls.every((control) => {
          const rect = control.getBoundingClientRect();
          return rect.width >= 44 && rect.height >= 44;
        }),
        controlsHaveNames: controls.every((control) => Boolean(
          control.getAttribute('aria-label') || control.textContent?.trim() || control.labels?.length,
        )),
      };
    });
    expect(layout.noHorizontalOverflow).toBe(true);
    expect(layout.targetsAtLeast44px).toBe(true);
    expect(layout.controlsHaveNames).toBe(true);
    expect(await page.evaluate(() => (window as any).__playedCalls)).toEqual([]);
    expectLocalOnly(page);
  });
}