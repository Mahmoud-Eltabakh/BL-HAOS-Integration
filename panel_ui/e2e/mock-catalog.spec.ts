import { expect, test, type Locator, type Page } from '@playwright/test';
import * as path from 'path';
import * as fs from 'fs';

async function openMockCard(page: Page): Promise<Locator> {
  await page.goto('/mock-harness.html', { waitUntil: 'domcontentloaded' });
  const panel = page.locator('bl-haos-media-card');
  await expect(panel).toHaveCount(1);

  // Poll until shadow root and internal state are ready
  await expect.poll(async () => {
    return await panel.evaluate((element: any) => {
      const supplied = element.hass;
      return Boolean(element.shadowRoot && supplied?.connection?.connected && supplied?.user?.id);
    });
  }).toBe(true);

  await panel.getByRole('button', { name: 'Browse media' }).click();
  await expect(panel.getByRole('heading', { name: 'Media Catalog' })).toBeVisible();

  return panel;
}

test.describe('Mock-HA Media Catalog Card', () => {
  test('browses catalog, selects connected speaker, and dispatches playback', async ({ page }) => {
    const panel = await openMockCard(page);

    // Verify Heading
    const heading = panel.locator('h1, h2').first();
    await expect(heading).toContainText('Media Catalog');

    // Verify Speaker Selector lists connected devices
    const selector = panel.locator('select#target-speaker-select, select').first();
    await expect(selector).toBeVisible();
    const options = await selector.locator('option').allTextContents();
    expect(options).toContain('Living Room Speaker');
    expect(options).toContain('Kitchen Speaker');
    // Verify disconnected speaker is excluded
    expect(options.some(opt => opt.includes('Disconnected Speaker'))).toBe(false);

    // Select the living room speaker
    await selector.selectOption({ label: 'Living Room Speaker' });

    // Verify Catalog Root lists Spotify Provider and Radio Stations
    await expect(panel.getByText('Spotify Provider')).toBeVisible();
    await expect(panel.getByText('Radio Stations')).toBeVisible();

    // Click into Spotify Provider via its Open button
    const openSpotify = panel.locator('button[aria-label="Open Spotify Provider"]');
    await expect(openSpotify).toBeVisible();
    await openSpotify.click();

    // Verify Chill Evening Beats playlist is visible
    await expect(panel.getByText('Chill Evening Beats')).toBeVisible();

    // Click Play on Chill Evening Beats
    const playBtn = panel.locator('button[aria-label*="Play Chill Evening Beats"], button:has-text("Play")').first();
    await expect(playBtn).toBeVisible();
    await playBtn.click();

    // Verify the played service call was dispatched with the opaque reference
    const calls = await page.evaluate(() => (window as any).__playedCalls);
    expect(calls.length).toBeGreaterThan(0);
    const lastCall = calls[calls.length - 1];
    expect(lastCall.domain).toBe('media_player');
    expect(lastCall.service).toBe('play_media');
    expect(lastCall.target.entity_id).toBe('media_player.living_room_speaker');
    expect(lastCall.data.media_content_id).toBe('media-source://spotify/playlist/chill-evening');
  });

  for (const width of [375, 768, 1440]) {
    test(`renders responsively with no overlap or clipping at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      const panel = await openMockCard(page);

      // Audit Layout constraints
      const metrics = await panel.evaluate((element: any) => {
        const shadow = element.shadowRoot;
        if (!shadow) return { ok: false, error: 'no shadow root' };

        const main = shadow.querySelector('main') || shadow.firstElementChild;
        const selector = shadow.querySelector('select');
        const styles = shadow.querySelector('style')?.textContent ?? '';
        const controls = Array.from(shadow.querySelectorAll('button, select, input, a')) as HTMLElement[];
        const visibleControls = controls.filter(c => c.getClientRects().length > 0);
        const rects = visibleControls.map(c => c.getBoundingClientRect());

        // Check the agreed 44px minimum hit area.
        const hitAreas = visibleControls.every(c => {
          const r = c.getBoundingClientRect();
          return r.width >= 44 && r.height >= 44;
        });

        // Check horizontal overflow
        const noOverflow = main ? main.scrollWidth <= main.clientWidth + 2 : true;

        // Check overlap
        const hasOverlap = rects.some((r1, i) =>
          rects.slice(i + 1).some(r2 =>
            Math.min(r1.right, r2.right) - Math.max(r1.left, r2.left) > 2 &&
            Math.min(r1.bottom, r2.bottom) - Math.max(r1.top, r2.top) > 2
          )
        );

        return {
          ok: true,
          hitAreas,
          noOverflow,
          noOverlap: !hasOverlap,
          cardSizing: (
            element.classList.contains('card-layout')
            && main?.classList.contains('card-layout') === true
            && styles.includes(':host(.card-layout) { height:auto; min-height:0; overflow:visible; }')
            && styles.includes('.neu-page.card-layout { height:auto; min-height:0; overflow:visible; }')
          ),
          controlCount: visibleControls.length
        };
      });

      expect(metrics.ok).toBe(true);
      expect(metrics.noOverflow).toBe(true);
      expect(metrics.noOverlap).toBe(true);
      expect(metrics.hitAreas).toBe(true);
      expect(metrics.cardSizing).toBe(true);

      // Ensure directory exists for screenshots
      const resultsDir = path.resolve(process.cwd(), 'test-results', 'ha-catalog');
      if (!fs.existsSync(resultsDir)) {
        fs.mkdirSync(resultsDir, { recursive: true });
      }

      // Capture screenshot
      await page.screenshot({
        path: path.join(resultsDir, `mock-catalog-${width}px.png`),
        fullPage: true,
      });
    });
  }

  test('expands and returns with keyboard focus restoration', async ({ page }) => {
    const panel = await openMockCard(page);

    // Select a target using the native keyboard control.
    const selector = panel.locator('select#target-speaker-select, select').first();
    await selector.focus();
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('Enter');

    // Open the provider and return using Enter and Escape rather than clicks.
    const openSpotify = panel.locator('button[aria-label="Open Spotify Provider"]');
    await expect(openSpotify).toBeVisible();
    await openSpotify.focus();
    await page.keyboard.press('Enter');
    await expect(panel.getByText('Chill Evening Beats', { exact: true })).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(panel.getByRole('heading', { name: 'Media sources' })).toBeVisible();
    await expect(openSpotify).toBeFocused();
  });
});
