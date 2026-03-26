// @resultsafe/core-fp-union/src/guards/isErrAnd.ts
import type { RefinedErr } from '../types/result/RefinedErr.js';
import type { VariantConfig } from '../types/variant/VariantConfig.js';

export const isErrAnd =
  <TMap extends Record<'err', VariantConfig>>(variantMap: TMap) =>
  <TExtra extends object = {}>(
    and: (v: RefinedErr<TMap>) => v is RefinedErr<TMap> & TExtra,
  ) =>
  (value: unknown): value is RefinedErr<TMap> & TExtra => {
    // Простая проверка
    if (
      typeof value !== 'object' ||
      value === null ||
      !('type' in value) ||
      (value as { type?: unknown }).type !== 'err'
    ) {
      return false;
    }

    // Применяем дополнительный предикат
    return and(value as RefinedErr<TMap>);
  };


