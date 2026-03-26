// @resultsafe/core-fp-union/src/guards/isVariant.ts
import type { VariantConfig } from '../types/variant/VariantConfig.js';
import type { VariantShape } from '../types/variant/VariantShape.js';

export const isVariant =
  <TMap extends Record<string, VariantConfig>>(variantMap: TMap) =>
  <K extends keyof TMap & string>(variant: K) =>
  (value: unknown): value is VariantShape<TMap, K> => {
    // Простая проверка без createResultValidator
    return (
      typeof value === 'object' &&
      value !== null &&
      'type' in value &&
      (value as { type?: unknown }).type === variant &&
      variant in variantMap
    );
  };


