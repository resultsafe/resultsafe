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
 * Creates an async variant refiner with async payload validators.
 *
 * @typeParam TMap - The variant configuration map type.
 * @param variantMap - The map describing valid variants and payload fields.
 * @returns A curried async refiner factory bound to `variantMap`.
 * @since 0.1.0
 * @see {@link refineAsyncResultU} - Direct (non-curried) helper variant.
 * @example
 * ```ts
 * import { refineAsyncResult } from '@resultsafe/core-fp-result';
 *
 * const map = { ok: { payload: 'value' } } as const;
 * const refineOk = refineAsyncResult(map)('ok')({
 *   value: async (x: unknown) => typeof x === 'number',
 * });
 *
 * console.log(await refineOk({ type: 'ok', value: 1 })); // { type: 'ok', value: 1 }
 * ```
 * @public
 */
export const refineAsyncResult =
  <TMap extends Record<string, VariantConfig>>(variantMap: TMap) =>
  <K extends keyof TMap & string>(variant: K) =>
  <TValidators extends Partial<Record<PayloadKeys<TMap[K]>, AsyncValidatorFn>>>(
    validators: TValidators,
  ) =>
  async (
    value: unknown,
  ): Promise<UniversalAsyncRefinedResult<K, TMap, TValidators> | null> => {
    if (!isObject(value)) return null;
    if (!hasOwn(value, 'type')) return null;

    const t = value['type'];
    if (t !== variant) return null;

    const config = variantMap[variant];
    if (!config) return null;

    const keys = getPayloadKeys(config);
    for (const key of keys) {
      const check = validators?.[key];
      if (!check) continue;

      const field = value[key as keyof typeof value];
      const isValid = await check(field); // ✅ Async validation
      if (!isValid) return null;
    }

    return value as UniversalAsyncRefinedResult<K, TMap, TValidators>;
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
 * @remarks
 * This export is kept for compatibility. Prefer {@link refineAsyncResultU}
 * from `refineAsyncResultU.ts` as the canonical non-curried entry point.
 * @since 0.1.0
 * @example
 * ```ts
 * import { refineAsyncResultU } from '@resultsafe/core-fp-result/src/refiners/refineAsyncResult.js';
 *
 * const map = { ok: { payload: 'value' } } as const;
 * const out = await refineAsyncResultU({ type: 'ok', value: 1 }, 'ok', map, {
 *   value: async (x: unknown) => typeof x === 'number',
 * });
 *
 * console.log(out?.type); // ok
 * ```
 * @internal
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
): Promise<UniversalAsyncRefinedResult<K, TMap, TValidators> | null> =>
  refineAsyncResult(variantMap)(variant)(validators)(value);
