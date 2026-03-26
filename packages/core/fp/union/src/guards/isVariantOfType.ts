// @resultsafe/core-fp-union/src/guards/isVariantOfType.ts
import type { PayloadKeys } from '../types/utils/PayloadKeys.js';
import type { PayloadValidator } from '../types/validation/PayloadValidator.js';
import type { ValidatorFn } from '../types/validation/ValidatorFn.js';
import type { VariantConfig } from '../types/variant/VariantConfig.js';
import type { VariantShape } from '../types/variant/VariantShape.js';

export const isVariantOfType =
  <TMap extends Record<string, VariantConfig>>(variantMap: TMap) =>
  <K extends keyof TMap & string>(
    variant: K,
    validators?: PayloadValidator<TMap[K]>,
  ) =>
  (value: unknown): value is VariantShape<TMap, K> => {
    // Базовая проверка структуры без createResultValidator
    if (
      typeof value !== 'object' ||
      value === null ||
      !('type' in value) ||
      (value as { type?: unknown }).type !== variant ||
      !(variant in variantMap)
    ) {
      return false;
    }

    // Проверка валидаторов
    if (validators) {
      const entries = Object.entries(validators) as Array<
        [PayloadKeys<TMap[K]>, ValidatorFn | undefined]
      >;

      for (const [key, check] of entries) {
        if (!check) continue;
        const obj = value as Record<string, unknown>;
        if (!Object.prototype.hasOwnProperty.call(obj, key)) return false;
        if (!check(obj[key])) return false;
      }
    }

    return true;
  };


