// @resultsafe/core-fp-union/src/guards/isOkAnd.ts
import type { RefinedOk } from '../types/result/RefinedOk.js';
import type { VariantConfig } from '../types/variant/VariantConfig.js';

export const isOkAnd =
  <TMap extends Record<'ok', VariantConfig>>(variantMap: TMap) =>
  <TExtra extends object = {}>(
    and: (v: RefinedOk<TMap>) => v is RefinedOk<TMap> & TExtra,
  ) =>
  (value: unknown): value is RefinedOk<TMap> & TExtra => {
    // Простая проверка без createResultValidator
    const isBasicOk =
      typeof value === 'object' &&
      value !== null &&
      'type' in value &&
      (value as { type?: unknown }).type === 'ok';

    if (!isBasicOk) return false;

    // Применяем дополнительный предикат
    return and(value as RefinedOk<TMap>);
  };


