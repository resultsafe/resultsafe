import { hasOwn, isObject } from '../internal/object.js';
import type { AsyncValidatorFn } from '../types/refiners/AsyncValidatorFn.js';
import type { PayloadKeys } from '../types/refiners/PayloadKeys.js';
import type { VariantConfig } from '../types/refiners/VariantConfig.js';
import type { UniversalAsyncRefinedResult } from './types/index.js';

/** Resolves payload keys from variant configuration. @internal */
const getPayloadKeys = <C extends VariantConfig>(
  config: C,
): readonly PayloadKeys<C>[] => {
  const p = config.payload;
  if (p === 'never') return [];
  return (Array.isArray(p) ? p : [p]) as readonly PayloadKeys<C>[];
};

/**
 * Refines a value asynchronously in non-curried call style.
 *
 * @typeParam TMap - The variant configuration map type.
 * @typeParam K - The target variant key.
 * @typeParam TValidators - The async validator map for payload fields.
 * @param value - The value to validate and refine.
 * @param variant - The target variant key.
 * @param variantMap - The variant configuration map.
 * @param validators - The async payload validators.
 * @returns A promise resolving to the refined value or `null`.
 * @since 0.1.0
 * @see {@link refineAsyncResult} - Curry-style async refiner constructor.
 * @example
 * ```ts
 * import { refineAsyncResultU } from '@resultsafe/core-fp-result';
 *
 * const map = { ok: { payload: 'value' } } as const;
 * const out = await refineAsyncResultU({ type: 'ok', value: 1 }, 'ok', map, {
 *   value: async (x: unknown) => typeof x === 'number',
 * });
 *
 * console.log(out?.type); // ok
 * ```
 * @public
 */
export const refineAsyncResultU = <
  TMap extends Record<string, VariantConfig>,
  K extends keyof TMap & string,
  TValidators extends Partial<Record<PayloadKeys<TMap[K]>, AsyncValidatorFn>>,
>(
  value: unknown,
  variant: K,
  variantMap: TMap,
  validators: TValidators,
): Promise<UniversalAsyncRefinedResult<K, TMap, TValidators> | null> => {
  // Imperative style with early returns (Rust-style)
  return (async () => {
    // Rust-style early returns with Option-like behavior
    if (!isObject(value)) return null;
    if (!hasOwn(value, 'type')) return null;

    const t = value['type'];
    if (t !== variant) return null;

    const config = variantMap[variant];
    if (!config) return null;

    // Payload validation with async validators
    const keys = getPayloadKeys(config);
    for (const key of keys) {
      const check = validators[key as keyof TValidators];
      if (!check) continue;

      const field = value[key as string];
      // Type-safe async validation
      const isValid = await (check as AsyncValidatorFn)(field);
      if (!isValid) return null;
    }

    // Safe cast after all checks
    return value as UniversalAsyncRefinedResult<K, TMap, TValidators>;
  })();
};
