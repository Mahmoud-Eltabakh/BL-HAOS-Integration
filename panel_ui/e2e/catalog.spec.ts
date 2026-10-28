import { expect, test, type Locator, type Page } from '@playwright/test';
import { classifyExpiryEvidence } from './expiry-evidence.mjs';
import { host } from './playwright.config';

interface Media {
  title: string;
  media_content_id: string;
  media_content_type: string;
  media_class?: string;
  can_expand: boolean;
  can_play: boolean;
  children?: Media[];
}
interface SuppliedHass {
  config: { version: string };
  connection: { connected: boolean };
  user: { id: string };
  states: Record<string, { state: string; attributes: Record<string, unknown> }>;
  callWS(message: { type: string; media_content_id?: string }): Promise<Media>;
  callService(domain: string, service: string, data: Record<string, unknown>, target: { entity_id: string }): Promise<unknown>;
}
interface Panel extends HTMLElement {
  hass: SuppliedHass;
  acceptance?: { plays: number; exact: boolean; forbidden: number; settled: boolean };
}

async function openPanel(page: Page): Promise<Locator> {
  await page.goto('/bl-haos-media', { waitUntil: 'domcontentloaded' });
  const panel = page.locator('bl-haos-media-panel');
  await expect(panel).toHaveCount(1);
  await expect.poll(() => panel.evaluate((element) => {
    const supplied = (element as Panel).hass;
    return Boolean(element.shadowRoot && supplied?.connection.connected && supplied.user?.id);
  })).toBe(true);
  expect(await panel.evaluate((element) => (element as Panel).hass.config.version === '2026.10.3')).toBe(true);
  await expect(panel.getByRole('heading', { name: 'Media Catalog', exact: true })).toBeVisible();
  await expect(panel.locator('section[aria-busy]')).toHaveAttribute('aria-busy', 'false');
  return panel;
}

async function providerPath(panel: Locator) {
  return panel.evaluate(async (element, expected) => {
    const supplied = (element as Panel).hass;
    const root = await supplied.callWS({ type: 'media_source/browse_media' });
    const provider = root.children?.find((item) => item.media_content_id === expected.provider && item.can_expand);
    if (!provider) throw new Error('Configured provider is not exposed at the public catalog root; layout acceptance pending');
    const pending = [{ item: provider, path: [provider.title], depth: 0 }];
    const visited = new Set<string>();
    while (pending.length && visited.size < 40) {
      const current = pending.shift()!;
      if (visited.has(current.item.media_content_id)) continue;
      visited.add(current.item.media_content_id);
      const result = await supplied.callWS({ type: 'media_source/browse_media', media_content_id: current.item.media_content_id });
      const playlist = result.children?.find((item) => item.media_content_id === expected.playlist);
      if (playlist) {
        if (!playlist.can_play || ![playlist.media_class, playlist.media_content_type].some((value) => value === 'playlist')) {
          throw new Error('Configured playlist lacks public playable-playlist metadata');
        }
        return { folders: current.path, title: playlist.title, type: playlist.media_content_type };
      }
      if (current.depth < 4) for (const child of result.children ?? []) {
        if (child.can_expand && !child.can_play && child.media_content_id.startsWith('media-source://')) {
          pending.push({ item: child, path: [...current.path, child.title], depth: current.depth + 1 });
        }
      }
    }
    throw new Error('Configured playlist not found within bounded public hierarchy; provider layout acceptance pending');
  }, { provider: host.provider, playlist: host.playlist });
}

async function auditLayout(panel: Locator) {
  return panel.evaluate((element) => {
    const shadow = element.shadowRoot!;
    const main = shadow.querySelector<HTMLElement>('main')!;
    const selector = shadow.querySelector<HTMLSelectElement>('select')!;
    const controls = [...shadow.querySelectorAll<HTMLElement>('button,select,input,a')].filter((control) => control.getClientRects().length);
    const rectangles = controls.map((control) => control.getBoundingClientRect());
    const overlap = rectangles.some((first, index) => rectangles.slice(index + 1).some((second) =>
      Math.min(first.right, second.right) - Math.max(first.left, second.left) > 1
      && Math.min(first.bottom, second.bottom) - Math.max(first.top, second.top) > 1));
    const luminance = (color: string) => {
      const channels = color.match(/[\d.]+/g)!.slice(0, 3).map(Number).map((channel) => {
        const value = channel / 255;
        return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
      });
      return channels[0] * 0.2126 + channels[1] * 0.7152 + channels[2] * 0.0722;
    };
    const surface = shadow.querySelector<HTMLElement>('.neu-surface')!;
    const contrast = [...shadow.querySelectorAll<HTMLElement>('h2,.metadata,.media-title')].every((text) => {
      const light = luminance(getComputedStyle(text).color);
      const dark = luminance(getComputedStyle(surface).backgroundColor);
      return (Math.max(light, dark) + 0.05) / (Math.min(light, dark) + 0.05) >= 4.5;
    });
    return {
      shadow: Boolean(shadow),
      noOverflow: main.scrollWidth <= main.clientWidth + 1 && [...shadow.querySelectorAll<HTMLElement>('.catalog-body,li')].every((item) => item.scrollWidth <= item.clientWidth + 1),
      selectorVisible: selector.getBoundingClientRect().left >= 0 && selector.getBoundingClientRect().right <= innerWidth,
      hitAreas: rectangles.every((rect) => rect.width >= 44 && rect.height >= 44),
      noOverlap: !overlap,
      labels: controls.every((control) => control.tagName === 'SELECT' ? Boolean(shadow.querySelector(`label[for="${control.id}"]`)) : Boolean(control.textContent?.trim() || control.getAttribute('aria-label'))),
      polite: Boolean(shadow.querySelector('[role="status"][aria-live="polite"][aria-atomic="true"]')),
      contrast,
      safeVisibleContent: !/(?:https?:\/\/|bearer\s|access_token|refresh_token|password\s*[=:]|token\s*[=:])/i.test(main.innerText),
      images: [...shadow.querySelectorAll('img')].every((image) => image.complete && image.naturalWidth > 0 && new URL(image.src).origin === location.origin),
    };
  });
}

test.beforeEach(async ({}, info) => {
  expect(info.project.use.trace).toBe('off');
  expect(info.project.use.video).toBe('off');
  expect(info.project.use.screenshot).toBe('off');
});

test('actual HA hierarchy, responsive shadow-root controls and one consented opaque native dispatch', async ({ page }, info) => {
  let pageErrors = 0;
  let forbiddenRequests = 0;
  page.on('pageerror', () => { pageErrors++; });
  page.on('request', (request) => {
    const parsed = new URL(request.url());
    if (/\/api\/(?:native|media|catalog)(?:\/|$)/.test(parsed.pathname)
      || (request.resourceType() === 'media' && parsed.origin !== host.baseURL)) forbiddenRequests++;
  });
  let panel = await openPanel(page);
  const metadata = await providerPath(panel);
  for (const width of [375, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    panel = await openPanel(page);
    expect(await panel.evaluate((element, target) => {
      const speaker = (element as Panel).hass.states[target];
      return Boolean(speaker && ['idle', 'playing', 'paused'].includes(speaker.state)
        && typeof speaker.attributes.adapter === 'string' && speaker.attributes.adapter.trim()
        && /^(?:[0-9a-f]{2}:){5}[0-9a-f]{2}$/i.test(String(speaker.attributes.bluetooth_address)));
    }, host.target)).toBe(true);
    await expect(panel.getByLabel('Play on', { exact: true })).toHaveValue('');
    for (const folder of metadata.folders) {
      const open = panel.getByRole('button', { name: `Open ${folder}`, exact: true });
      await expect(open).toHaveCount(1);
      await open.click();
      await expect(panel.locator('section[aria-busy]')).toHaveAttribute('aria-busy', 'false');
    }
    const play = panel.getByRole('button', { name: `Play ${metadata.title}`, exact: true });
    await expect(play).toHaveCount(1);
    await expect(play).toBeDisabled();
    await panel.getByLabel('Play on', { exact: true }).selectOption(host.target);
    await expect(play).toBeEnabled();
    expect(await panel.locator('.selected-target').evaluate((detail) => detail.scrollWidth <= detail.clientWidth + 1 && Boolean(detail.textContent?.trim()))).toBe(true);
    await panel.getByLabel('Play on', { exact: true }).focus();
    await page.keyboard.press('Tab');
    expect(await panel.evaluate((element) => element.shadowRoot?.activeElement?.getAttribute('aria-label') === 'Close catalog')).toBe(true);
    expect(await panel.getByRole('link', { name: 'Close catalog' }).evaluate((element) => getComputedStyle(element).outlineStyle !== 'none')).toBe(true);
    const layout = await auditLayout(panel);
    expect(Object.values(layout).every(Boolean), 'Host geometry/assets/content guard failed; sensitive details suppressed').toBe(true);
    await page.emulateMedia({ reducedMotion: 'reduce' });
    expect(await play.evaluate((element) => getComputedStyle(element).transitionDuration.split(',').every((duration) => parseFloat(duration) === 0))).toBe(true);
    await panel.screenshot({ path: info.outputPath(`catalog-${width}.png`), animations: 'disabled' });
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await page.keyboard.press('Escape');
    expect(await panel.evaluate((element) => element.shadowRoot?.activeElement?.getAttribute('aria-label')?.startsWith('Open ') === true)).toBe(true);
    const lastFolder = metadata.folders[metadata.folders.length - 1];
    await panel.getByRole('button', { name: `Open ${lastFolder}`, exact: true }).click();
    await expect(panel.locator('section[aria-busy]')).toHaveAttribute('aria-busy', 'false');
  }
  await panel.evaluate((element, expected) => {
    const current = element as Panel;
    const supplied = current.hass;
    const audit = { plays: 0, exact: true, forbidden: 0, settled: false };
    current.acceptance = audit;
    const originalPlay = supplied.callService.bind(supplied);
    const originalBrowse = supplied.callWS.bind(supplied);
    supplied.callWS = (message) => {
      if (message.type.includes('resolve')) { audit.forbidden++; throw new Error('Browser resolution is forbidden'); }
      return originalBrowse(message);
    };
    supplied.callService = async (domain, service, data, target) => {
      if (domain !== 'media_player' || service !== 'play_media') return originalPlay(domain, service, data, target);
      audit.plays++;
      audit.exact = audit.exact && audit.plays === 1 && target.entity_id === expected.target
        && data.media_content_id === expected.playlist && data.media_content_type === expected.type
        && Object.keys(target).length === 1 && Object.keys(data).length === 2;
      if (!audit.exact) throw new Error('Unexpected dispatch blocked before playback');
      const result = await originalPlay(domain, service, data, target);
      audit.settled = true;
      return result;
    };
  }, { target: host.target, playlist: host.playlist, type: metadata.type });
  await panel.getByRole('button', { name: `Play ${metadata.title}`, exact: true }).click();
  await expect.poll(() => panel.evaluate((element) => {
    const audit = (element as Panel).acceptance;
    return Boolean(audit?.settled && audit.exact && audit.plays === 1 && audit.forbidden === 0);
  })).toBe(true);
  expect(pageErrors).toBe(0);
  expect(forbiddenRequests).toBe(0);
});

test('independent unauthenticated context is denied without touching the shared session', async ({ browser }) => {
  const denied = await browser.newContext({ storageState: { cookies: [], origins: [] }, acceptDownloads: false });
  try {
    const response = await denied.request.get(`${host.baseURL}/api/config`);
    expect([401, 403].includes(response.status())).toBe(true);
  } finally { await denied.close(); }
});

test('separately attested expired disposable fixture is rejected by HA auth without accepted calls', async ({ browser }) => {
  const disposable = await browser.newContext({ storageState: host.expiryStorageState, baseURL: host.baseURL, acceptDownloads: false });
  try {
    // Only origin-local pathname and status are recorded; bodies, headers and queries are never read.
    const responses = { accepted: 0, unauthorized: 0, forbidden: 0, tokenRejected: 0 };
    disposable.on('response', (response) => {
      const url = new URL(response.url());
      if (url.origin !== host.baseURL) return;
      const status = response.status();
      const tokenEndpoint = url.pathname === '/auth/token';
      if (!tokenEndpoint && !url.pathname.startsWith('/api/')) return;
      if (status >= 200 && status < 300) responses.accepted++;
      else if (tokenEndpoint && (status === 400 || status === 401)) responses.tokenRejected++;
      else if (status === 401) responses.unauthorized++;
      else if (status === 403) responses.forbidden++;
    });
    const page = await disposable.newPage();
    await page.goto('/bl-haos-media', { waitUntil: 'domcontentloaded' });
    const observe = async () => {
      let session: { hass: { connected: boolean; user: boolean } | null; probe: 'accepted' | { code: string | number } | null } = { hass: null, probe: null };
      const panel = page.locator('bl-haos-media-panel');
      if (await panel.count() === 1) {
        try {
          session = await panel.evaluate(async (element) => {
            const supplied = (element as Panel).hass;
            if (!supplied?.connection) return { hass: null, probe: null };
            let probe: 'accepted' | { code: string | number } | null = null;
            try {
              await Promise.race([
                supplied.callWS({ type: 'media_source/browse_media' }),
                new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), 2000)),
              ]);
              probe = 'accepted';
            } catch (error) {
              const code = (error as { code?: unknown })?.code;
              probe = typeof code === 'number' || typeof code === 'string' ? { code } : null;
            }
            return { hass: { connected: supplied.connection.connected === true, user: Boolean(supplied.user?.id) }, probe };
          });
        } catch { /* panel detached by HA navigation; hass treated as absent */ }
      }
      return classifyExpiryEvidence({ attested: host.expiryAttested, pathname: new URL(page.url()).pathname, ...session, responses: { ...responses } });
    };
    await expect.poll(observe, { timeout: 60_000, intervals: [2000], message: 'Expiry not proven: attested expired fixture must reach HA login or auth rejection with no accepted call; disconnect or denial is not expiry' }).toBe('expired');
    expect(responses.accepted).toBe(0);
  } finally { await disposable.close(); }
});