import { defineConfig, devices } from '@playwright/test';
import { randomInt } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.dirname(fileURLToPath(import.meta.url));
const vulnerable = process.env.VULNERABLE_MODE === 'true';
/** Random API port so Playwright never proxies to an unrelated long-lived dev server. */
const apiPort = String(randomInt(4100, 4900));

export default defineConfig({
  testDir: path.join(root, 'e2e'),
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: 1,
  reporter: 'list',
  use: {
    baseURL: 'http://127.0.0.1:5173',
    trace: 'on-first-retry',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: {
    // Force the flag in the shell command so Windows + npm webServer reliably inherit VULNERABLE_MODE.
    command: vulnerable
      ? `npx cross-env VULNERABLE_MODE=true PORT=${apiPort} API_PORT=${apiPort} npm run dev`
      : `npx cross-env VULNERABLE_MODE=false PORT=${apiPort} API_PORT=${apiPort} npm run dev`,
    cwd: root,
    url: 'http://127.0.0.1:5173',
    // Always start a fresh dev server so fixed vs vulnerable runs are not confused with an old process.
    reuseExistingServer: false,
    timeout: 120_000,
  },
});
