// @resultsafe/core-fp-union/src/guards/isSuccess.ts
import type { RefinedSuccess } from '../types/result/RefinedSuccess.js';
import type { VariantConfig } from '../types/variant/VariantConfig.js';

export const isSuccess =
  <TMap extends Record<'success', VariantConfig>>(variantMap: TMap) =>
  (value: unknown): value is RefinedSuccess<TMap> => {
    // Простая реализация без validators
    return (
      typeof value === 'object' &&
      value !== null &&
      'type' in value &&
      (value as { type?: unknown }).type === 'success'
    );
  };


