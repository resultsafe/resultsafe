import { createRequire } from 'node:module';
import { resolve } from 'path';
import { defineConfig, type UserConfig } from 'vite';
import dts from 'vite-plugin-dts';
import tsconfigPaths from 'vite-tsconfig-paths';

const require = createRequire(import.meta.url);
const aliases: Record<
  string,
  string
> = require('../../../../../config/aliases/cjs/aliases.cjs');

// Определяем формат сборки: esm | cjs | umd | all
const formatEnv = process.env['BUILD_FORMAT'] as string | undefined;
const formats = formatEnv ? [formatEnv] : ['esm', 'cjs', 'umd'];

// Точка входа
const libEntry = resolve(__dirname, '../src/index.ts');

export default defineConfig((): UserConfig => {
  return {
    build: {
      sourcemap: true,
      target: 'esnext',
      minify: false,
      lib: {
        entry: libEntry,
        name: 'ResultsafeFpResult',
        formats: formats.map((f) =>
          f === 'esm' ? 'es' : f === 'cjs' ? 'cjs' : 'umd',
        ),
        fileName: (format) => {
          if (format === 'es') return 'index.js';
          if (format === 'cjs') return 'index.js';
          return 'resultsafe-monorepo-core-fp-result.umd.js';
        },
      },
      outDir: resolve(__dirname, '../dist', formatEnv || 'all'),
      emptyOutDir: formatEnv === 'esm', // очищаем только при первой сборке
      rollupOptions: {
        external: [
          /^node:/,
          'chalk',
          '@resultsafe/core-fp-option',
          '@resultsafe/core-fp-result-shared',
          '@resultsafe/core-fp-union',
        ],
        output: {
          globals: {
            '@resultsafe/core-fp-option': 'FpOption',
            '@resultsafe/core-fp-union': 'FpUnion',
          },
        },
      },
    },
    resolve: {
      extensions: ['.ts'],
      alias: Object.entries(aliases).map(([find, replacement]) => ({
        find,
        replacement,
      })),
    },
    plugins: [
      tsconfigPaths(),
      dts({
        root: resolve(__dirname, '..'),
        entryRoot: resolve(__dirname, '../src'),
        outDir: resolve(__dirname, '../dist/types'),
        tsconfigPath: resolve(__dirname, './tsconfig.build.types.json'),
        insertTypesEntry: true,
        rollupTypes: true,
        pathsToAliases: true,
      }),
    ],
  };
});


