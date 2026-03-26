// config/vite.config.build.esm.ts
import { resolve } from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    // Минификация отключена, чтобы сохранять читаемый код
    minify: false,

    lib: {
      entry: resolve(__dirname, '../src/index.ts'),
      formats: ['es'],
      fileName: () => 'index.js', // сохраняем имя index.js
    },

    outDir: resolve(__dirname, '../dist/esm'),
    sourcemap: true,
    target: 'ES2022',

    rollupOptions: {
      external: [
        '@resultsafe/core-fp-option',
        '@resultsafe/core-fp-option-shared',
        '@resultsafe/core-fp-result-shared',
        '@resultsafe/core-fp-union',
        /^node:/,
      ],

      output: {
        format: 'es',
        exports: 'named',
        preserveModules: true, // ✅ сохраняем структуру src/**
        preserveModulesRoot: 'src',
        entryFileNames: '[name].js',

        compact: false, // ✅ читаемый код
        indent: '  ',
        interop: 'esModule',

        generatedCode: {
          symbols: false,
          constBindings: true,
          objectShorthand: true,
          reservedNamesAsProps: false,
        },
      },

      treeshake: {
        moduleSideEffects: false,
        propertyReadSideEffects: false,
        tryCatchDeoptimization: false,
      },
    },
  },

  esbuild: {
    minifyIdentifiers: false,
    minifySyntax: false,
    minifyWhitespace: false,
    keepNames: true, // ✅ сохраняем имена функций
    legalComments: 'none',
  },

  define: {
    __DEV__: process.env['NODE_ENV'] === 'development',
    __PROD__: process.env['NODE_ENV'] === 'production',
  },

  optimizeDeps: {
    exclude: [
      '@resultsafe/core-fp-option',
      '@resultsafe/core-fp-option-shared',
      '@resultsafe/core-fp-result-shared',
      '@resultsafe/core-fp-union',
    ],
  },
});


