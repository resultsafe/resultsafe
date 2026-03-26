// @resultsafe/core-fp-union/src/guards/isValidatedResult.ts
import type { CreateAnyResult } from '../types/result/CreateAnyResult.js';
import type { VariantConfig } from '../types/variant/VariantConfig.js';

export const isValidatedResult =
  <TMap extends Record<string, VariantConfig>>(variantMap: TMap) =>
  (
    value: unknown,
    validators?: Partial<{
      [K in keyof TMap]: Partial<
        Record<
          TMap[K]['payload'] extends string
            ? TMap[K]['payload']
            : TMap[K]['payload'] extends readonly string[]
              ? TMap[K]['payload'][number]
              : never,
          (x: unknown) => x is unknown
        >
      >;
    }>,
  ): value is CreateAnyResult<TMap> => {
    // Простая проверка структуры без createResultValidator
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


