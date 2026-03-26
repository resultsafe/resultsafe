// config/vite.build.umd.ts
import { resolve } from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    target: 'ES2022',
    sourcemap: true,
    minify: 'esbuild', // Минификация синтаксиса, но сохраняем читаемость

    lib: {
      entry: resolve(__dirname, '../src/index.ts'),
      name: 'ResultsafeFpResult', // Глобальный объект для UMD
      formats: ['umd'],
      fileName: () => 'resultsafe-monorepo-core-fp-result.umd.js', // фиксированное имя
    },

    outDir: resolve(__dirname, '../dist/umd'),

    rollupOptions: {
      external: [
        '@resultsafe/core-fp-option',
        '@resultsafe/core-fp-option-shared',
        '@resultsafe/core-fp-result-shared',
        '@resultsafe/core-fp-union',
      ],

      output: {
        globals: {
          '@resultsafe/core-fp-option': 'FpOption',
          '@resultsafe/core-fp-union': 'FpUnion',
        },
        exports: 'named',
        compact: false, // читаемый код
        interop: 'esModule',
        manualChunks: undefined, // всё в один файл
        generatedCode: {
          symbols: false, // без Symbol.toStringTag
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
    minifyIdentifiers: false, // сохраняем читаемые имена переменных
    minifySyntax: true, // минифицируем синтаксис
    minifyWhitespace: true, // убираем лишние пробелы
    keepNames: true, // сохраняем имена функций для debugging
    legalComments: 'none', // удаляем комментарии лицензий
  },

  define: {
    'process.env.NODE_ENV': JSON.stringify(
      process.env['NODE_ENV'] || 'production',
    ),
  },
});


