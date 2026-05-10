import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { createApp } from '../src/app.js';

export function createTestApp() {
  const dbPath = join(tmpdir(), `securevault-test-${Date.now()}-${Math.random().toString(16).slice(2)}.db`);
  const app = createApp({ dbPath });
  return { app, dbPath };
}
