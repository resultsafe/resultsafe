// config/vite.config.shared.ts
import type { ExternalOption, OutputOptions, RollupOptions } from 'rollup';
import type { ESBuildOptions } from 'vite';

// =============================================================================
// ТИПЫ ДЛЯ РАСШИРЕНИЯ
// =============================================================================

export interface SharedPaths {
  readonly src: string;
  readonly dist: string;
  readonly entry: string;
}

export interface SharedDefine {
  readonly __DEV__: boolean;
  readonly __PROD__: boolean;
  readonly [key: string]: unknown;
}

// =============================================================================
// ОСНОВНЫЕ КОНСТАНТЫ
// =============================================================================

// Общие зависимости
export const SHARED_EXTERNALS: ExternalOption = [
  '@resultsafe/core-fp-option',
  '@resultsafe/core-fp-option-shared',
  '@resultsafe/core-fp-result-shared',
  '@resultsafe/core-fp-union',
  /^node:/,
] as const;

// Общие настройки Rollup
export const SHARED_ROLLUP_OPTIONS: Readonly<
  Omit<RollupOptions, 'external' | 'output'>
> = {
  treeshake: {
    moduleSideEffects: false,
    propertyReadSideEffects: false,
    tryCatchDeoptimization: false,
  },
} as const;

// Общие настройки output
export const SHARED_OUTPUT_OPTIONS: Readonly<OutputOptions> = {
  exports: 'named',
  compact: false,
  generatedCode: {
    symbols: false,
    constBindings: true,
    objectShorthand: true,
    reservedNamesAsProps: false,
  },
} as const;

// Общие esbuild настройки
export const SHARED_ESBUILD_OPTIONS: Readonly<ESBuildOptions> = {
  minifyIdentifiers: false,
  minifySyntax: false,
  minifyWhitespace: false,
  keepNames: true,
  legalComments: 'none',
} as const;

// Общие define переменные
export const SHARED_DEFINE: Readonly<SharedDefine> = {
  __DEV__: process.env['NODE_ENV'] === 'development',
  __PROD__: process.env['NODE_ENV'] === 'production',
} as const;

// Paths
export const PATHS: Readonly<SharedPaths> = {
  src: '../src',
  dist: '../dist',
  entry: '../src/index.ts',
} as const;

// =============================================================================
// УТИЛИТЫ ДЛЯ РАСШИРЕНИЯ
// =============================================================================

/**
 * Расширяемый тип для конфигурации сборки
 */
export type ExtendableBuildConfig = {
  readonly external?: ExternalOption;
  readonly output?: OutputOptions;
};

/**
 * Утилита для безопасного слияния конфигураций
 */
export const mergeConfig = <T extends Record<string, unknown>>(
  base: T,
  ...extensions: Partial<T>[]
): T => {
  return extensions.reduce((acc, ext) => ({ ...acc, ...ext }), base) as T;
};

/**
 * Утилита для фильтрации строковых зависимостей
 */
export const getStringExternals = (externals: ExternalOption): string[] => {
  return Array.isArray(externals)
    ? externals.filter((dep): dep is string => typeof dep === 'string')
    : [];
};


