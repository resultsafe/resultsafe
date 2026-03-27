import tsParser from '@typescript-eslint/parser';
import jsdocPlugin from 'eslint-plugin-jsdoc';
import { defineConfig } from 'eslint/config';

export default defineConfig([
  {
    files: ['**/__examples__/**/*.ts'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 2022,
        sourceType: 'module',
        project: './tsconfig.json',
      },
    },
    plugins: {
      jsdoc: jsdocPlugin,
    },
    rules: {
      'jsdoc/require-description': 'warn',
      'jsdoc/require-example': 'warn',
      'no-console': 'off',
    },
  },
]);
