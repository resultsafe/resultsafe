// vitest.config.ts
import tsconfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [
    tsconfigPaths(),
    {
      name: 'clear-on-start',
      configResolved() {
        if (process.stdout.isTTY) {
          console.clear();
        }
      },
    },
  ],
  resolve: {
    alias: {
      '@resultsafe/core-fp-result': new URL(
        './packages/core/fp/result/src/index.ts',
        import.meta.url,
      ).pathname,
      '@resultsafe/core-fp-shared': new URL(
        './packages/core/fp/shared/src/index.ts',
        import.meta.url,
      ).pathname,
      '@resultsafe/core-fp-union': new URL(
        './packages/core/fp/union/src/index.ts',
        import.meta.url,
      ).pathname,
      '@resultsafe/core-fp-option': new URL(
        './packages/core/fp/option/src/index.ts',
        import.meta.url,
      ).pathname,
      '@resultsafe/core-fp-either': new URL(
        './packages/core/fp/either/src/index.ts',
        import.meta.url,
      ).pathname,
      '@resultsafe/core-fp-void': new URL(
        './packages/core/fp/void/src/index.ts',
        import.meta.url,
      ).pathname,
      '@resultsafe/core-fp-task': new URL(
        './packages/core/fp/task/src/index.ts',
        import.meta.url,
      ).pathname,
      '@resultsafe/core-fp-task-result': new URL(
        './packages/core/fp/task-result/src/index.ts',
        import.meta.url,
      ).pathname,
      '@resultsafe/core-fp-effect': new URL(
        './packages/core/fp/effect/src/index.ts',
        import.meta.url,
      ).pathname,
      '@resultsafe/core-fp-pipe': new URL(
        './packages/core/fp/pipe/src/index.ts',
        import.meta.url,
      ).pathname,

      '@resultsafe/core-fp-flow': new URL(
        './packages/core/fp/flow/src/index.ts',
        import.meta.url,
      ).pathname,

      '@resultsafe/core-fp-do': new URL(
        './packages/core/fp/do/src/index.ts',
        import.meta.url,
      ).pathname,

      '@resultsafe/core-fp-layer': new URL(
        './packages/core/fp/layer/src/index.ts',
        import.meta.url,
      ).pathname,

      '@resultsafe/core-fp-context': new URL(
        './packages/core/fp/context/src/index.ts',
        import.meta.url,
      ).pathname,

      '@resultsafe/core-fp-codec': new URL(
        './packages/core/fp/codec/src/index.ts',
        import.meta.url,
      ).pathname,

      '@resultsafe/core-fp-module-loader': new URL(
        './packages/core/fp/module-loader/src/index.ts',
        import.meta.url,
      ).pathname,

      '@resultsafe/core-fp-codec-zod': new URL(
        './packages/adapter/core/fp/codec/zod/src/index.ts',
        import.meta.url,
      ).pathname,
    },
  },
  test: {
    globals: true,
    environment: 'node',
  },
});


