import { createRequire } from 'node:module';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'url';
import { defineConfig } from 'vitest/config';

// Импорт CJS файла через require
const require = createRequire(import.meta.url);
const aliases: Record<
  string,
  string
> = require('../../../../../config/aliases/cjs/aliases.cjs');

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig({
  root: resolve(__dirname, '..'), // корень пакета types
  resolve: {
    alias: Object.entries(aliases).map(([find, replacement]) => ({
      find,
      replacement: resolve(__dirname, '..', replacement),
    })),
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
      reporter: ['text', 'json', 'html'],
    },
  },
});
