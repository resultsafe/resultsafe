// config/vite.config.build.types.ts
import { resolve } from 'path';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

export default defineConfig({
  build: {
    // Минификация не нужна для деклараций
    minify: false,
    sourcemap: false,
    lib: {
      entry: resolve(__dirname, '../src/index.ts'),
      formats: ['es'], // форматы неважны, генерируем только типы
    },
    outDir: resolve(__dirname, '../dist/types'),
    emptyOutDir: true,
    rollupOptions: {
      external: [
        '@resultsafe/core-fp-option',
        '@resultsafe/core-fp-option-shared',
        '@resultsafe/core-fp-result-shared',
        '@resultsafe/core-fp-union',
      ],
      output: {
        preserveModules: true, // сохраняем структуру src/**
        preserveModulesRoot: 'src', // корень исходников
        entryFileNames: '[name].d.ts', // имена файлов .d.ts
      },
    },
  },
  plugins: [
    dts({
      entryRoot: resolve(__dirname, '../src'),
      outDir: resolve(__dirname, '../dist/types'),
      insertTypesEntry: true, // создаёт index.d.ts на уровне dist/types
      rollupTypes: true, // нужен для preserveModules
    }),
  ],
});


