import { expect, test, type Locator, type Page } from '@playwright/test';
import * as path from 'path';
import * as fs from 'fs';

type MockArea = 'library' | 'browse' | 'speakers' | 'settings';

for (const theme of ['light', 'dark'] as const) {
  test(`bright HA cyan retains primary-action and active-navigation contrast in ${theme}`, async ({ page }) => {
    const panel = await openMockCard(page, { area: 'library', theme, cardWidth: 480 });
    await page.evaluate(() => {
      document.documentElement.style.setProperty('--primary-color', '#009ac7');
      document.documentElement.style.setProperty('--text-primary-color', '#ffffff');
    });
    await expect.poll(async () => {
      const colors = await panel.evaluate((element) => {
        const root = element.shadowRoot!;
        return [...root.querySelectorAll('.primary-button:not(:disabled),.view-toggle [aria-pressed="true"]')]
          .map((node) => {
            const style = getComputedStyle(node);
            return { foreground: style.color, background: style.backgroundColor };
          });
      });
      return colors.length >= 2 && colors.every(({ foreground, background }) =>
        contrastRatio(foreground, background) >= 4.5);
    }).toBe(true);
  });
}

function contrastRatio(foreground: string, background: string): number {
  const luminance = (color: string) => {
    const channels = color.match(/[\d.]+/g)?.slice(-3).map(Number);
    if (!channels || channels.length !== 3) return 0;
    const scale = color.includes('color(srgb') ? 255 : 1;
    const linear = channels.map((channel) => {
      const value = channel * scale / 255;
      return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
    });
    return 0.2126 * linear[0] + 0.7152 * linear[1] + 0.0722 * linear[2];
  };
  const light = luminance(foreground);
  const dark = luminance(background);
  return (Math.max(light, dark) + 0.05) / (Math.min(light, dark) + 0.05);
}

async function openMockCard(
  page: Page,
  options: { area?: MockArea; theme?: 'light' | 'dark'; cardWidth?: number; scenario?: string } = {},
): Promise<Locator> {
  const { area = 'browse', theme = 'light', cardWidth, scenario } = options;
  const params = new URLSearchParams({ area, theme });
  if (cardWidth) params.set('card', String(cardWidth));
  if (scenario) params.set('scenario', scenario);
  await page.goto(`/mock-harness.html?${params}`, { waitUntil: 'domcontentloaded' });
  const panel = page.locator('bl-haos-media-card');
  await expect(panel).toHaveCount(1);

  // Poll until shadow root and internal state are ready
  await expect.poll(async () => {
    return await panel.evaluate((element: any) => {
      const supplied = element.hass;
      return Boolean(element.shadowRoot && supplied?.connection?.connected && supplied?.user?.id);
    });
  }).toBe(true);

  if (area === 'browse') {
    await panel.getByRole('button', { name: 'Browse media' }).click();
    await expect(panel.getByRole('heading', { name: 'Media Catalog' })).toBeVisible();
  } else if (area === 'library') {
    await panel.getByRole('button', { name: 'Library', exact: true }).click();
    await expect(panel.getByRole('heading', { name: 'Media Library' })).toBeVisible();
    if (scenario !== 'library-error') {
      await expect(panel.getByText('Mock saved playlist', { exact: true })).toBeVisible();
    }
  } else {
    await panel.getByRole('button', { name: 'Speakers', exact: true }).click();
    await expect(panel.getByRole('heading', { name: 'Speakers', exact: true })).toBeVisible();
    if (area === 'settings') {
      await panel.getByRole('region', { name: 'System settings' }).scrollIntoViewIfNeeded();
    }
  }

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
            && styles.includes('container-type:inline-size')
            && styles.includes('@container (max-width:640px)')
            && !styles.includes('height:100dvh')
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

  test('Library theme and container-width tracer', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    const panel = await openMockCard(page, { area: 'library', theme: 'light', cardWidth: 320 });
    const styleState = await panel.evaluate((element: any) => {
      const main = element.shadowRoot.querySelector('main') as HTMLElement;
      const computed = getComputedStyle(main);
      return {
        themeSurface: getComputedStyle(document.documentElement).getPropertyValue('--ha-card-background').trim(),
        mainBackground: computed.backgroundColor,
        mainText: computed.color,
        width: Math.round(element.getBoundingClientRect().width),
        overflow: main.scrollWidth > main.clientWidth + 1,
      };
    });
    expect(styleState.themeSurface).toBe('#fff');
    expect(styleState.mainBackground).toBe('rgb(245, 247, 250)');
    expect(styleState.mainText).toBe('rgb(32, 42, 53)');
    expect(styleState.width).toBeLessThanOrEqual(320);
    expect(styleState.width).toBeGreaterThanOrEqual(318);
    expect(styleState.overflow).toBe(false);

    await panel.getByRole('button', { name: 'Browse media' }).click();
    await expect(panel.getByRole('heading', { name: 'Media Catalog' })).toBeVisible();
    await panel.getByRole('button', { name: 'Library', exact: true }).click();
    await expect(panel.getByRole('heading', { name: 'Media Library' })).toBeVisible();
    await page.keyboard.press('Tab');
    await panel.getByRole('button', { name: 'Library', exact: true }).focus();
    const focusStyle = await panel.getByRole('button', { name: 'Library', exact: true }).evaluate((button) => {
      const style = getComputedStyle(button);
      return { width: style.outlineWidth, style: style.outlineStyle };
    });
    expect(focusStyle.width).toBe('2px');
    expect(focusStyle.style).toBe('solid');
    await page.emulateMedia({ reducedMotion: 'reduce' });
    const transition = await panel.getByRole('button', { name: 'Library', exact: true })
      .evaluate((button) => getComputedStyle(button).transitionDuration);
    expect(transition.split(',').every((duration) => Number.parseFloat(duration) === 0)).toBe(true);
    const resultsDir = path.resolve(process.cwd(), 'test-results', 'ha-card-polish');
    fs.mkdirSync(resultsDir, { recursive: true });
    await page.screenshot({ path: path.join(resultsDir, 'library-light-320-tracer.png'), fullPage: true });
  });

  for (const area of ['library', 'browse', 'speakers', 'settings'] as const) {
    for (const theme of ['light', 'dark'] as const) {
      for (const cardWidth of [320, 480, 720]) {
        test(`${area} ${theme} theme at ${cardWidth}px card width`, async ({ page }) => {
          await page.setViewportSize({ width: 1440, height: 900 });
          const panel = await openMockCard(page, { area, theme, cardWidth });
          await page.waitForTimeout(200);
          const metrics = await panel.evaluate((element: any) => {
            const shadow = element.shadowRoot as ShadowRoot;
            const main = shadow.querySelector('main') as HTMLElement;
            const controls = Array.from(shadow.querySelectorAll('button,select,input,a')) as HTMLElement[];
            const visible = controls.filter((control) => control.getClientRects().length > 0);
            const rectangles = visible.map((control) => control.getBoundingClientRect());
            const overlaps = rectangles.some((first, index) => rectangles.slice(index + 1).some((second) =>
              Math.min(first.right, second.right) - Math.max(first.left, second.left) > 2
              && Math.min(first.bottom, second.bottom) - Math.max(first.top, second.top) > 2));
            const contained = rectangles.every((rect) =>
              rect.width >= 44 && rect.height >= 44
              && rect.left >= main.getBoundingClientRect().left - 1
              && rect.right <= main.getBoundingClientRect().right + 1);
            const styles = shadow.querySelector('style')?.textContent ?? '';
            const pageStyle = getComputedStyle(main);
            return {
              overflow: main.scrollWidth > main.clientWidth + 1 || element.scrollWidth > element.clientWidth + 1,
              overlaps,
              contained,
              surfaceToken: getComputedStyle(document.documentElement).getPropertyValue('--ha-card-background').trim(),
              colorScheme: getComputedStyle(document.documentElement).colorScheme,
              text: pageStyle.color,
              background: pageStyle.backgroundColor,
              disabledText: (() => {
                const disabled = shadow.querySelector('button:disabled,select:disabled,input:disabled') as HTMLElement | null;
                return disabled ? getComputedStyle(disabled).color : null;
              })(),
              disabledBackground: (() => {
                const disabled = shadow.querySelector('button:disabled,select:disabled,input:disabled') as HTMLElement | null;
                return disabled ? getComputedStyle(disabled).backgroundColor : null;
              })(),
              focusRule: styles.includes(':focus-visible'),
              reducedMotionRule: styles.includes('@media(prefers-reduced-motion:reduce)')
                && styles.includes('transition:none !important'),
              targetCount: visible.length,
            };
          });
          expect(metrics.overflow).toBe(false);
          expect(metrics.overlaps).toBe(false);
          expect(metrics.contained).toBe(true);
          expect(metrics.targetCount).toBeGreaterThan(0);
          expect(metrics.surfaceToken).not.toBe('');
          expect(metrics.colorScheme).toBe(theme);
          expect(metrics.text).not.toBe('');
          expect(metrics.background).not.toBe('rgba(0, 0, 0, 0)');
          expect(contrastRatio(metrics.text, metrics.background)).toBeGreaterThanOrEqual(4.5);
          if (metrics.disabledText && metrics.disabledBackground
            && metrics.disabledBackground !== 'rgba(0, 0, 0, 0)') {
            expect(contrastRatio(metrics.disabledText, metrics.disabledBackground)).toBeGreaterThanOrEqual(4.5);
          }
          expect(metrics.focusRule).toBe(true);
          expect(metrics.reducedMotionRule).toBe(true);

          if (area === 'settings') {
            await expect(panel.getByRole('region', { name: 'System settings' })).toBeVisible();
            await expect(panel.getByRole('combobox', { name: 'Log level' })).toBeVisible();
          } else if (area === 'speakers') {
            await expect(panel.getByRole('region', { name: 'Bluetooth adapters' })).toBeVisible();
            await expect(panel.getByRole('button', { name: 'Scan', exact: true })).toBeVisible();
          } else if (area === 'browse') {
            await expect(panel.getByRole('heading', { name: 'Media Catalog' })).toBeVisible();
          } else {
            await expect(panel.getByRole('heading', { name: 'Media Library' })).toBeVisible();
            await expect(panel.getByRole('status')).toBeVisible();
            const createButton = await panel.getByRole('button', { name: 'Create playlist' }).evaluate((button) => {
              const style = getComputedStyle(button);
              return { color: style.color, background: style.backgroundColor };
            });
            expect(contrastRatio(createButton.color, createButton.background), JSON.stringify(createButton)).toBeGreaterThanOrEqual(4.5);
          }

          const resultsDir = path.resolve(process.cwd(), 'test-results', 'ha-card-polish');
          fs.mkdirSync(resultsDir, { recursive: true });
          await page.screenshot({
            path: path.join(resultsDir, `${area}-${theme}-${cardWidth}.png`),
            fullPage: true,
          });
        });
      }

      for (const viewportWidth of [375, 768, 1440]) {
        test(`${area} ${theme} stays card-driven at ${viewportWidth}px viewport`, async ({ page }) => {
          await page.setViewportSize({ width: viewportWidth, height: 900 });
          const panel = await openMockCard(page, { area, theme, cardWidth: 320 });
          const sizes = await panel.evaluate((element: any) => {
            const main = element.shadowRoot.querySelector('main') as HTMLElement;
            return {
              card: Math.round(element.getBoundingClientRect().width),
              content: Math.round(main.getBoundingClientRect().width),
              overflow: main.scrollWidth > main.clientWidth + 1 || element.scrollWidth > element.clientWidth + 1,
            };
          });
          expect(sizes.card).toBeLessThanOrEqual(320);
          expect(sizes.card).toBeGreaterThanOrEqual(318);
          expect(sizes.content).toBeLessThanOrEqual(sizes.card);
          expect(sizes.overflow).toBe(false);
        });
      }
    }
  }

  test('library error is legible and retry feedback remains available', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    const panel = await openMockCard(page, { area: 'library', theme: 'dark', cardWidth: 320, scenario: 'library-error' });
    const error = panel.getByRole('alert');
    await expect(error).toContainText('Reconnect Home Assistant');
    await expect(panel.getByRole('button', { name: 'Retry loading' })).toBeVisible();
    const colors = await error.evaluate((element) => {
      const main = element.getRootNode() instanceof ShadowRoot
        ? (element.getRootNode() as ShadowRoot).querySelector('main') as HTMLElement
        : element.parentElement as HTMLElement;
      return { foreground: getComputedStyle(element).color, background: getComputedStyle(main).backgroundColor };
    });
    expect(colors.foreground).toBe('rgb(255, 180, 171)');
    expect(contrastRatio(colors.foreground, colors.background)).toBeGreaterThanOrEqual(4.5);
    const resultsDir = path.resolve(process.cwd(), 'test-results', 'ha-card-polish');
    fs.mkdirSync(resultsDir, { recursive: true });
    await page.screenshot({ path: path.join(resultsDir, 'library-dark-320-error.png'), fullPage: true });
  });
});
