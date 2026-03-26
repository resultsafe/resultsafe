// @resultsafe/core-fp-union/src/guards/isResult.ts
import type { CreateAnyResult } from '../types/result/CreateAnyResult.js';
import type { VariantConfig } from '../types/variant/VariantConfig.js';

export const isResult =
  <TMap extends Record<string, VariantConfig>>(variantMap: TMap) =>
  (value: unknown): value is CreateAnyResult<TMap> => {
    // Простая проверка без createResultValidator
    if (
      typeof value !== 'object' ||
      value === null ||
      !('type' in value) ||
      typeof (value as { type?: unknown }).type !== 'string'
    ) {
      return false;
    }

    const type = (value as { type: string }).type;
    return type in variantMap;
  };


