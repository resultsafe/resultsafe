// @resultsafe/core-fp-result/config/vite.config.build.cjs.ts
import { resolve } from 'node:path';

import { defineConfig } from 'vite';

import {
  PATHS,
  SHARED_EXTERNALS,
  SHARED_OUTPUT_OPTIONS,
  SHARED_ROLLUP_OPTIONS,
} from './vite.config.shared.js';

// =============================================================================
// CJS BUILD CONFIGURATION
// =============================================================================
export default defineConfig({
  build: {
    target: 'ES2022',
    sourcemap: true, // сохраняем source maps
    minify: false, // не минифицируем, чтобы код оставался читаемым

    lib: {
      entry: resolve(__dirname, PATHS.entry),
      formats: ['cjs'],
      fileName: () => 'index.js', // все файлы сохраняют оригинальные имена
    },

    outDir: resolve(__dirname, '../dist/cjs'),

    rollupOptions: {
      external: SHARED_EXTERNALS,
      ...SHARED_ROLLUP_OPTIONS,

      output: {
        format: 'cjs',
        ...SHARED_OUTPUT_OPTIONS,
        exports: 'named', // именованные экспорты для TypeScript
        preserveModules: true, // сохраняем структуру src/**
        preserveModulesRoot: 'src', // корень исходников
        entryFileNames: '[name].js', // сохраняем имена файлов

        interop: 'auto', // правильная работа с ESM зависимостями
      },
    },
  },
});
