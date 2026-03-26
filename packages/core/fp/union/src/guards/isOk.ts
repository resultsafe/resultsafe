// @resultsafe/core-fp-union/src/guards/isOk.ts
import type { RefinedOk } from '../types/result/RefinedOk.js';
import type { VariantConfig } from '../types/variant/VariantConfig.js';

export const isOk =
  <TMap extends Record<'ok', VariantConfig>>(variantMap: TMap) =>
  (
    value: unknown,
    validators?: Partial<
      Record<
        TMap['ok']['payload'] extends string
          ? TMap['ok']['payload']
          : TMap['ok']['payload'] extends readonly string[]
            ? TMap['ok']['payload'][number]
            : never,
        (x: unknown) => x is unknown
      >
    >,
  ): value is RefinedOk<TMap> => {
    // Простая проверка без createResultValidator
    return (
      typeof value === 'object' &&
      value !== null &&
      'type' in value &&
      (value as { type?: unknown }).type === 'ok'
    );
  };


