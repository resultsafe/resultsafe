// @resultsafe/core-fp-result/config/vite.config.build.cjs.ts
import { resolve } from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    target: 'ES2022',
    sourcemap: true, // сохраняем source maps
    minify: false, // не минифицируем, чтобы код оставался читаемым

    lib: {
      entry: resolve(__dirname, '../src/index.ts'),
      formats: ['cjs'],
      fileName: () => 'index.js', // все файлы сохраняют оригинальные имена
    },

    outDir: resolve(__dirname, '../dist/cjs'),

    rollupOptions: {
      external: [
        '@resultsafe/core-fp-option',
        '@resultsafe/core-fp-option-shared',
        '@resultsafe/core-fp-result-shared',
        '@resultsafe/core-fp-union',
        /^node:/, // исключаем Node.js встроенные модули
      ],

      output: {
        exports: 'named', // именованные экспорты для TypeScript
        preserveModules: true, // сохраняем структуру src/**
        preserveModulesRoot: 'src', // корень исходников
        entryFileNames: '[name].js', // сохраняем имена файлов

        compact: false, // читаемый код
        interop: 'auto', // правильная работа с ESM зависимостями

        generatedCode: {
          symbols: false, // не используем Symbol.toStringTag
          constBindings: true, // const для неизменяемых переменных
          objectShorthand: true, // объектный шорткат
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
});


