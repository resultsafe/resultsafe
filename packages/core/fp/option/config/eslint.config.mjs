import tsPlugin from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import eslintConfigPrettier from 'eslint-config-prettier';
import importPlugin from 'eslint-plugin-import';
import prettierPlugin from 'eslint-plugin-prettier';
import { defineConfig } from 'eslint/config';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Динамический импорт simple-import-sort
const simpleImportSortPlugin = (
  await import('eslint-plugin-simple-import-sort')
).default;

const aliasesModule = await import(
  'file://' +
    new URL('../../../../../config/aliases/cjs/aliases.cjs', import.meta.url)
      .pathname
);
const aliases = aliasesModule.default ?? aliasesModule;

export default defineConfig([
  {
    ignores: [
      '**/dist',
      '**/vite.config.ts',
      '**/vitest.config.ts',
      '**/eslint.config.*',
      '**/*.js',
    ],
  },
  {
    files: [
      '../src/**/*.ts',
      '../__tests__/**/*.ts',
      '../__examples__/**/*.ts',
    ],
    plugins: {
      '@typescript-eslint': tsPlugin,
      import: importPlugin,
      'simple-import-sort': simpleImportSortPlugin,
      prettier: prettierPlugin,
    },
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: ['./tsconfig.eslint.json'], // ESLint TS проект
        tsconfigRootDir: resolve(__dirname), // корень пакета
        sourceType: 'module',
        ecmaVersion: 'latest',
      },
    },
    settings: {
      'import/resolver': {
        alias: {
          map: Object.entries(aliases),
          extensions: ['.ts'],
        },
      },
    },
    rules: {
      ...eslintConfigPrettier.rules,
      'prettier/prettier': 'warn',
      'import/order': 'off',
      'simple-import-sort/imports': 'warn',
      'simple-import-sort/exports': 'warn',
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-unsafe-assignment': 'error',
      '@typescript-eslint/no-unsafe-call': 'error',
      '@typescript-eslint/no-unsafe-member-access': 'error',
      '@typescript-eslint/no-unsafe-return': 'error',
      '@typescript-eslint/strict-boolean-expressions': 'error',
      '@typescript-eslint/no-non-null-assertion': 'error',
      '@typescript-eslint/no-floating-promises': 'error',
      '@typescript-eslint/await-thenable': 'error',
      '@typescript-eslint/no-misused-promises': [
        'error',
        { checksVoidReturn: { arguments: false, attributes: false } },
      ],
      '@typescript-eslint/restrict-template-expressions': [
        'error',
        { allowNumber: true, allowBoolean: true },
      ],
      '@typescript-eslint/restrict-plus-operands': 'error',
      '@typescript-eslint/no-base-to-string': 'error',
      '@typescript-eslint/unbound-method': 'error',
      '@typescript-eslint/require-await': 'error',
      '@typescript-eslint/prefer-nullish-coalescing': 'error',
      '@typescript-eslint/prefer-optional-chain': 'error',
    },
  },
]);
