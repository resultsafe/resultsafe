import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    globals: true,
    // Include example files (not just .test.ts)
    include: ['__examples__/**/*.ts'],
    // Exclude files that shouldn't run
    exclude: [
      '**/node_modules/**',
      '**/dist/**',
      '**/*.d.ts',
      '**/*.test.ts', // Regular tests run separately
    ],
    // Don't watch example files by default
    watch: false,
    // Fail on console errors
    dangerouslyIgnoreUnhandledErrors: false,
  },
});
