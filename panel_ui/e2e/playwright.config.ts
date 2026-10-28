import { defineConfig } from '@playwright/test';
import { loadHostEnvironment } from './host-env.mjs';

export const host = loadHostEnvironment();

export default defineConfig({
  testDir: '.',
  testMatch: 'catalog.spec.ts',
  outputDir: '../test-results/ha-catalog',
  reporter: [['./safe-reporter.mjs']],
  fullyParallel: false,
  workers: 1,
  retries: 0,
  forbidOnly: true,
  timeout: 120_000,
  expect: { timeout: 15_000 },
  use: {
    browserName: 'chromium',
    baseURL: host.baseURL,
    storageState: host.storageState,
    trace: 'off',
    video: 'off',
    screenshot: 'off',
    viewport: { width: 1440, height: 900 },
    acceptDownloads: false,
  },
});