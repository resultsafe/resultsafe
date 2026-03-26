import { readFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const allowlistPath = resolve(__dirname, 'publish-allowlist.json');

const raw = await readFile(allowlistPath, 'utf8');
const parsed = JSON.parse(raw);
const allowlist = new Set(parsed.packages ?? []);

const cliPackages = process.argv.slice(2);
const envPackages = (process.env['RELEASE_PACKAGES'] ?? '')
  .split(',')
  .map((v) => v.trim())
  .filter(Boolean);

const toCheck = [...new Set([...cliPackages, ...envPackages])];

if (toCheck.length === 0) {
  console.error(
    'No packages provided. Pass package names as args or set RELEASE_PACKAGES.',
  );
  process.exit(1);
}

const denied = toCheck.filter((name) => !allowlist.has(name));
if (denied.length > 0) {
  console.error('Publish allowlist check failed.');
  for (const name of denied) {
    console.error(`- ${name} is not allowed for publish`);
  }
  process.exit(1);
}

console.log(`Publish allowlist check passed for: ${toCheck.join(', ')}`);
