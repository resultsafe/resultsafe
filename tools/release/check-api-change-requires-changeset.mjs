import { spawnSync } from 'node:child_process';

function git(args) {
  return spawnSync('git', args, { encoding: 'utf8' });
}

const rev = git(['rev-parse', '--is-inside-work-tree']);
if (rev.status !== 0) {
  console.warn('[release] Git repository not detected, skipping API changeset policy check.');
  process.exit(0);
}

const baseRef = process.env['GITHUB_BASE_REF'] ? `origin/${process.env['GITHUB_BASE_REF']}` : 'origin/main';
let diff = git(['diff', '--name-only', `${baseRef}...HEAD`]);
if (diff.status !== 0) {
  diff = git(['diff', '--name-only', 'HEAD~1...HEAD']);
}
if (diff.status !== 0) {
  const isCi = process.env['CI'] === 'true';
  if (isCi) {
    console.error('[release] Failed to evaluate changed files for API policy.');
    process.exit(1);
  }
  console.warn('[release] Unable to compute changed files locally, skipping API changeset policy check.');
  process.exit(0);
}

const changed = diff.stdout
  .split(/\r?\n/)
  .map((v) => v.trim())
  .filter(Boolean);

const hasApiChange = changed.some((f) => {
  if (f.startsWith('packages/core/fp/result/src/')) return true;
  if (f === 'packages/core/fp/result/package.json') return true;
  return false;
});

if (!hasApiChange) {
  console.log('[release] No API-sensitive changes found for core-fp-result.');
  process.exit(0);
}

const hasChangeset = changed.some((f) => {
  return f.startsWith('.changeset/') && f.endsWith('.md') && f !== '.changeset/README.md';
});

if (!hasChangeset) {
  console.error(
    '[release] API-sensitive changes detected in core-fp-result, but no changeset markdown was added.',
  );
  console.error('[release] Add a changeset via `pnpm changeset:add` or `pnpm changeset:add:result`.');
  process.exit(1);
}

console.log('[release] API changeset policy passed.');
