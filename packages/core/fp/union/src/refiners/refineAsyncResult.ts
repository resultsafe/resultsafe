// @resultsafe/core-fp-union/src/refiners/refineAsyncResult.ts
import type { RefinedResult } from '../types/result/RefinedResult.js';
import type { PayloadKeys } from '../types/utils/PayloadKeys.js';
import type { AsyncValidatorFn } from '../types/validation/AsyncValidatorFn.js';
import type { VariantConfig } from '../types/variant/VariantConfig.js';

export const refineAsyncResult = <
  const TMap extends Record<string, VariantConfig>,
  const K extends keyof TMap & string,
  const TValidators extends Partial<
    Record<PayloadKeys<TMap[K]>, AsyncValidatorFn>
  >,
>(
  value: unknown,
  variant: K,
  variantMap: TMap,
  validators: TValidators,
): Promise<RefinedResult<K, TMap, TValidators> | null> =>
  (async () => {
    if (
      typeof value !== 'object' ||
      value === null ||
      !('type' in value) ||
      (value as { type?: unknown })['type'] !== variant
    ) {
      return null;
    }

    const config = variantMap[variant];
    if (!config) return null;

    const rawPayload = config.payload;
    const keys: readonly PayloadKeys<typeof config>[] =
      rawPayload === 'never'
        ? []
        : Array.isArray(rawPayload)
          ? rawPayload
          : [rawPayload];

    for (const key of keys) {
      const validator = validators?.[key];
      if (!validator) continue;

      const field = (value as Record<string, unknown>)[key];
      const isValid = await validator(field);
      if (!isValid) return null;
    }

    return value as RefinedResult<K, TMap, TValidators>;
  })();


