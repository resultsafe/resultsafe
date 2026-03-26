// @resultsafe/core-fp-union/src/guards/isFailure.ts
import type { RefinedFailure } from '../types/result/RefinedFailure.js';
import type { VariantConfig } from '../types/variant/VariantConfig.js';

export const isFailure =
  <TMap extends Record<'failure', VariantConfig>>(variantMap: TMap) =>
  (
    value: unknown,
    validators?: Partial<
      Record<
        TMap['failure']['payload'] extends string
          ? TMap['failure']['payload']
          : TMap['failure']['payload'] extends readonly string[]
            ? TMap['failure']['payload'][number]
            : never,
        (x: unknown) => x is unknown
      >
    >,
  ): value is RefinedFailure<TMap> => {
    // Простая проверка без createResultValidator
    return (
      typeof value === 'object' &&
      value !== null &&
      'type' in value &&
      (value as { type?: unknown }).type === 'failure'
    );
  };


