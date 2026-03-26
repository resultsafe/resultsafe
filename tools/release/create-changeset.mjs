import { mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const DEFAULT_PACKAGE = '@resultsafe/core-fp-result';
const DEFAULT_BUMP = 'patch';
const allowedBumps = new Set(['patch', 'minor', 'major']);

const args = process.argv.slice(2);

function readArg(flag, fallback = '') {
  const i = args.indexOf(flag);
  if (i === -1) return fallback;
  return args[i + 1] ?? fallback;
}

const targetPackage = readArg('--package', DEFAULT_PACKAGE).trim() || DEFAULT_PACKAGE;
const bump = readArg('--bump', DEFAULT_BUMP).trim() || DEFAULT_BUMP;
const summary = readArg('--summary', '').trim();

if (!allowedBumps.has(bump)) {
  console.error(`Invalid bump "${bump}". Allowed: patch, minor, major.`);
  process.exit(1);
}

const stamp = new Date().toISOString().replace(/[:.]/g, '-');
const slugBase = (summary || 'result-release-note')
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-+|-+$/g, '')
  .slice(0, 40) || 'result-release-note';
const filename = `${stamp}-${slugBase}.md`;

const bodySummary = summary || 'Describe user-visible change here.';
const content = `---
"${targetPackage}": ${bump}
---

${bodySummary}

Release notes:
- Added:
- Changed:
- Fixed:
`;

const dir = resolve('.changeset');
await mkdir(dir, { recursive: true });
const path = resolve(dir, filename);
await writeFile(path, content, 'utf8');

console.log(`Created changeset: ${path}`);
