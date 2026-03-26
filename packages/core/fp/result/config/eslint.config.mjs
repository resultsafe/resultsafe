import tsPlugin from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import eslintConfigPrettier from 'eslint-config-prettier';
import importPlugin from 'eslint-plugin-import';
import jsdocPlugin from 'eslint-plugin-jsdoc';
import prettierPlugin from 'eslint-plugin-prettier';
import { defineConfig } from 'eslint/config';
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Динамический импорт simple-import-sort
const simpleImportSortPlugin = (
  await import('eslint-plugin-simple-import-sort')
).default;

const repoRoot = resolve(__dirname, '../../../../../');

// Dynamic import of @resultsafe/eslint-plugin using absolute path
const resultsafePluginPath = resolve(repoRoot, 'tools/eslint-plugin/index.js');
const resultsafePlugin = (
  await import(`file:///${resultsafePluginPath.replace(/\\/g, '/')}`)
).default;
const tsconfigAliasesPath = resolve(repoRoot, 'tsconfig.aliases.json');
const tsconfigAliases = JSON.parse(
  readFileSync(tsconfigAliasesPath, 'utf8'),
);
const aliases = Object.entries(tsconfigAliases.compilerOptions?.paths ?? {})
  .filter(
    ([key, values]) =>
      !key.includes('*') && Array.isArray(values) && values.length > 0,
  )
  .map(([find, values]) => [find, resolve(repoRoot, values[0])]);

export default defineConfig([
  {
    ignores: [
      '**/dist',
      '__examples__/**',
      '__scripts__/**',
      'config/__diff__/**',
      '**/vite.config.ts',
      '**/vitest.config.ts',
      '**/eslint.config.*',
      '**/*.js',
      '.tmp-smoke/**',
      '__tests__/**',
    ],
  },
  {
    files: [
      'src/**/*.ts',
      '__tests__/**/*.ts',
      'config/**/*.ts',
    ],
    plugins: {
      '@typescript-eslint': tsPlugin,
      import: importPlugin,
      jsdoc: jsdocPlugin,
      'simple-import-sort': simpleImportSortPlugin,
      prettier: prettierPlugin,
      '@resultsafe': resultsafePlugin,
    },
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: ['./config/tsconfig.eslint.json'],
        tsconfigRootDir: resolve(__dirname, '..'),
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
      // JSDoc rules (SPEC-003) — all errors, strict mode
      'jsdoc/require-description': 'error',
      'jsdoc/require-example': 'error',
      'jsdoc/check-tag-names': 'off', // @typeParam is TSDoc standard; we allow all standard tags
      'jsdoc/require-param-description': 'error',
      'jsdoc/require-returns-description': 'error',
      'jsdoc/require-returns': 'error',
      'jsdoc/check-types': 'error',
      // Custom @resultsafe rules
      '@resultsafe/require-since-version': 'error',
    },
  },
  // Internal files: relaxed JSDoc rules (no @example required)
  {
    files: ['src/internal/**/*.ts'],
    rules: {
      'jsdoc/require-example': 'off',
      'jsdoc/require-returns': 'off',
    },
  },
  // Refiners: relaxed JSDoc rules (no @example required for internal utilities)
  {
    files: ['src/refiners/**/*.ts'],
    rules: {
      'jsdoc/require-example': 'off',
      'jsdoc/require-returns': 'off',
    },
  },
  // Config files: relaxed JSDoc rules (no @example required for build utilities)
  {
    files: ['config/**/*.ts'],
    rules: {
      'jsdoc/require-example': 'off',
      'jsdoc/require-returns': 'off',
      '@resultsafe/require-since-version': 'off', // Config files don't need @since
    },
  },
  // Internal files: relaxed JSDoc rules
  {
    files: ['src/internal/**/*.ts'],
    rules: {
      'jsdoc/require-example': 'off',
      'jsdoc/require-returns': 'off',
      '@resultsafe/require-since-version': 'off', // Internal utilities don't need @since
    },
  },
  // Refiner types: relaxed JSDoc rules
  {
    files: ['src/refiners/types/**/*.ts'],
    rules: {
      'jsdoc/require-example': 'off',
      'jsdoc/require-returns': 'off',
      '@resultsafe/require-since-version': 'off', // Type-only files don't need @since
    },
  },
]);
