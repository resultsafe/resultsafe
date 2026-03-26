// @resultsafe/core-fp-union/src/guards/isVariantAnd.ts
import type { RefinedVariant } from '../types/result/RefinedVariant.js';
import type { PayloadKeys } from '../types/utils/PayloadKeys.js';
import type { PayloadValidator } from '../types/validation/PayloadValidator.js';
import type { ValidatorFn } from '../types/validation/ValidatorFn.js';
import type { VariantConfig } from '../types/variant/VariantConfig.js';

export const isVariantAnd =
  <TMap extends Record<string, VariantConfig>>(variantMap: TMap) =>
  <K extends keyof TMap & string, TExtra extends object = {}>(
    variant: K,
    and: (v: RefinedVariant<TMap, K>) => v is RefinedVariant<TMap, K> & TExtra,
    validators?: PayloadValidator<TMap[K]>,
  ) =>
  (value: unknown): value is RefinedVariant<TMap, K> & TExtra => {
    // 1) Базовая структурная проверка
    if (
      typeof value !== 'object' ||
      value === null ||
      !('type' in value) ||
      (value as { type?: unknown }).type !== variant ||
      !(variant in variantMap)
    ) {
      return false;
    }

    // 2) Применяем валидаторы (если заданы)
    if (validators) {
      const entries = Object.entries(validators) as Array<
        [PayloadKeys<TMap[K]>, ValidatorFn | undefined]
      >;

      for (const [key, check] of entries) {
        if (!check) continue;
        const obj = value as Record<string, unknown>;
        if (!Object.prototype.hasOwnProperty.call(obj, key as string))
          return false;
        if (!check(obj[key as string])) return false;
      }
    }

    // 3) Пользовательское дополнительное сужение
    return and(value as RefinedVariant<TMap, K>);
  };


