// @resultsafe/core-fp-union/src/types/variant-config.ts

export interface VariantConfig {
  readonly payload: 'never' | string | readonly string[];
  readonly forbidden?: string | undefined;
  readonly strictFields?: boolean | undefined;
}

export const DEFAULT_VARIANT_CONFIG: VariantConfig = {
  payload: 'never',
  forbidden: undefined,
  strictFields: undefined,
} as const;


