import { mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createApp } from './app.js';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const dataDir = process.env.DATA_DIR || join(__dirname, '..', 'data');
mkdirSync(dataDir, { recursive: true });
const dbPath = process.env.DB_PATH || join(dataDir, 'securevault.db');

const app = createApp({ dbPath });
const port = Number(process.env.PORT || 3001);

app.listen(port, '127.0.0.1', () => {
  // eslint-disable-next-line no-console
  console.log(`SecureVault API http://localhost:${port} (VULNERABLE_MODE=${process.env.VULNERABLE_MODE || 'false'})`);
});
