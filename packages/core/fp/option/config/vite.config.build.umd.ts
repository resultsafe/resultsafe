import { resolve } from 'node:path';
import { defineConfig } from 'vite';
import {
  PATHS,
  SHARED_EXTERNALS,
  SHARED_OUTPUT_OPTIONS,
  SHARED_ROLLUP_OPTIONS,
  getStringExternals,
} from './vite.config.shared.js';

// =============================================================================
// UMD BUILD CONFIGURATION
// =============================================================================
const umdConfig = defineConfig({
  build: {
    target: 'ES2022',
    sourcemap: true,
    minify: 'esbuild', // Минификация для UMD

    lib: {
      entry: resolve(__dirname, PATHS.entry),
      name: 'ResultsafeFpOption', // Глобальное имя
      formats: ['umd'],
      fileName: () => 'resultsafe-monorepo-core-fp-option.umd.js',
    },

    outDir: resolve(__dirname, '../dist/umd'),

    rollupOptions: {
      external: SHARED_EXTERNALS,
      ...SHARED_ROLLUP_OPTIONS,

      output: {
        format: 'umd',
        name: 'ResultsafeFpResult',
        ...SHARED_OUTPUT_OPTIONS,

        globals: {
          '@resultsafe/core-fp-option-shared': 'FpOptionShared',
          '@resultsafe/core-fp-result-shared': 'FpResultShared',
        },

        interop: 'esModule', // чтобы CommonJS-зависимости имели .default
      },
    },
  },

  esbuild: {
    minifyIdentifiers: false,
    minifySyntax: true,
    minifyWhitespace: true,
    keepNames: true,
    legalComments: 'none',
  },

  optimizeDeps: {
    exclude: getStringExternals(SHARED_EXTERNALS),
  },
});

export default umdConfig;


