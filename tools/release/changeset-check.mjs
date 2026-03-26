import { spawnSync } from 'node:child_process';

const result = spawnSync('pnpm', ['exec', 'changeset', 'status', '--verbose'], {
  stdio: 'inherit',
  shell: process.platform === 'win32',
});

if (result.status === 0) {
  process.exit(0);
}

const isCi = process.env['CI'] === 'true';
if (isCi) {
  process.exit(result.status ?? 1);
}

console.warn(
  '[release] Skipping strict changeset status check locally: git main divergence context is unavailable.',
);
process.exit(0);
