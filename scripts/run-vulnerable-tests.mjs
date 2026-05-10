import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const env = {
  ...process.env,
  VULNERABLE_MODE: 'true',
};

function run(cmd, args) {
  const r = spawnSync(cmd, args, { cwd: root, env, stdio: 'inherit', shell: process.platform === 'win32' });
  return r.status ?? 1;
}

let failed = false;
if (run('npm', ['run', 'test:api', '-w', 'server']) !== 0) {
  failed = true;
}
if (run('npx', ['playwright', 'test']) !== 0) {
  failed = true;
}
process.exit(failed ? 1 : 0);
