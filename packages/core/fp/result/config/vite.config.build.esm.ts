// @resultsafe/core-fp-result/config/vite.config.build.esm.ts
import { resolve } from 'path';
import { defineConfig } from 'vite';

import {
  getStringExternals,
  PATHS,
  SHARED_DEFINE,
  SHARED_ESBUILD_OPTIONS,
  SHARED_EXTERNALS,
  SHARED_OUTPUT_OPTIONS,
  SHARED_ROLLUP_OPTIONS,
} from './vite.config.shared.js';

export default defineConfig({
  // Build configuration
  build: {
    minify: false,

    // Library configuration
    lib: {
      entry: resolve(__dirname, PATHS.entry),
      formats: ['es'],
      fileName: () => 'index.js',
    },

    // Output directory
    outDir: resolve(__dirname, '../dist/esm'),

    // Source maps for debugging
    sourcemap: true,

    // Source maps for debugging
    target: 'ES2022',

    // Rollup options from shared config
    rollupOptions: {
      external: SHARED_EXTERNALS,
      ...SHARED_ROLLUP_OPTIONS,

      output: {
        format: 'es',
        ...SHARED_OUTPUT_OPTIONS,
        preserveModules: true, // ✅ сохраняем структуру src/**
        preserveModulesRoot: 'src',
        entryFileNames: '[name].js',

        interop: 'esModule',
      },
    },
  },
  esbuild: SHARED_ESBUILD_OPTIONS,
  define: SHARED_DEFINE,
  optimizeDeps: {
    exclude: getStringExternals(SHARED_EXTERNALS),
  },
});
