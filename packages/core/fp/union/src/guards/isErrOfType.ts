// @resultsafe/core-fp-union/src/guards/isErrOfType.ts
import type { RefinedErr } from '../types/result/RefinedErr.js';
import type { VariantConfig } from '../types/variant/VariantConfig.js';

export const isErrOfType =
  <TMap extends Record<'err', VariantConfig>>(variantMap: TMap) =>
  (
    value: unknown,
    validators: Partial<
      Record<
        TMap['err']['payload'] extends string
          ? TMap['err']['payload']
          : TMap['err']['payload'] extends readonly string[]
            ? TMap['err']['payload'][number]
            : never,
        (x: unknown) => x is unknown
      >
    >,
  ): value is RefinedErr<TMap> => {
    // Простая проверка без createResultValidator
    if (
      typeof value !== 'object' ||
      value === null ||
      !('type' in value) ||
      (value as { type?: unknown }).type !== 'err'
    ) {
      return false;
    }

    // Здесь можно добавить валидацию payload если нужно
    // Но для простой проверки типа достаточно базовой проверки выше

    return true;
  };


