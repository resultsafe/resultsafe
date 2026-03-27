import type { PayloadKeys } from '../types/refiners/PayloadKeys.js';
import type { ValidatorFn } from '../types/refiners/ValidatorFn.js';
import type { VariantConfig } from '../types/refiners/VariantConfig.js';
import { refineResult } from './refineResult.js';
import type { SyncRefinedResult } from './types/index.js';

/**
 * Refines a value by variant map in non-curried call style.
 *
 * @typeParam TMap - The variant configuration map type.
 * @typeParam K - The target variant key.
 * @typeParam TValidators - The validator map for payload fields.
 * @param value - The value to validate and refine.
 * @param variant - The target variant key.
 * @param variantMap - The variant configuration map.
 * @param validators - The payload validators for the target variant.
 * @returns The refined value or `null`.
 * @since 0.1.0
 * @see {@link refineResult} - Curry-style refiner constructor.
 * @example
 * ```ts
 * import { refineResultU } from '@resultsafe/core-fp-result';
 *
 * const map = { ok: { payload: 'value' } } as const;
 * const out = refineResultU({ type: 'ok', value: 1 }, 'ok', map, {
 *   value: (x: unknown): x is number => typeof x === 'number',
 * });
 *
 * console.log(out?.type); // ok
 * ```
 * @public
 */
export const refineResultU = <
  TMap extends Record<string, VariantConfig>,
  K extends keyof TMap & string,
  TValidators extends Partial<Record<PayloadKeys<TMap[K]>, ValidatorFn>>,
>(
  value: unknown,
  variant: K,
  variantMap: TMap,
  validators: TValidators,
): SyncRefinedResult<K, TMap, TValidators> | null =>
  refineResult(variantMap)(variant)(validators)(value);
