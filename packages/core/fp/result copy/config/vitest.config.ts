import { dirname, resolve } from 'node:path';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'url';
import { defineConfig } from 'vitest/config';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const repoRoot = resolve(__dirname, '../../../../../');
const tsconfigAliasesPath = resolve(repoRoot, 'tsconfig.aliases.json');
const tsconfigAliases = JSON.parse(
  readFileSync(tsconfigAliasesPath, 'utf8'),
) as {
  compilerOptions?: { paths?: Record<string, string[]> };
};

const aliases = Object.entries(tsconfigAliases.compilerOptions?.paths ?? {})
  .filter(([key, values]) => !key.includes('*') && Array.isArray(values) && values.length > 0)
  .map(([find, values]) => ({
    find,
    replacement: resolve(repoRoot, values[0]!),
  }));

export default defineConfig({
  root: resolve(__dirname, '..'), // корень пакета types
  resolve: {
    alias: aliases,
  },
  test: {
    environment: 'node',
    globals: true,
    include: [
      '__tests__/unit/**/*.test.ts',
      '__tests__/integration/**/*.test.ts',
    ],
    exclude: ['**/*.js'],
    coverage: {
      provider: 'v8',
      all: true,
      include: ['src/**/*.{ts,tsx}'],
      exclude: ['src/refiners/types/**/*.{ts,tsx}'],
      reporter: ['text', 'json', 'html'],
    },
  },
});
