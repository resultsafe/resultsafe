import type { PayloadKeys } from '../types/refiners/PayloadKeys.js';
import type { ValidatorFn } from '../types/refiners/ValidatorFn.js';
import type { VariantConfig } from '../types/refiners/VariantConfig.js';
import type { SyncRefinedResultUnion } from './types/SyncRefinedResultUnion.js';
import type { SyncValidatorMap } from './types/SyncValidatorMap.js';

/**
 * Refines a discriminated union value by a full variant map.
 *
 * @typeParam TMap - The variant configuration map type.
 * @typeParam TValidators - The validator map type by variant.
 * @param value - The value to validate and refine.
 * @param variantMap - The full variant configuration map.
 * @param validators - The validators grouped by variant key.
 * @returns The refined union member or `null`.
 * @since 0.1.0
 * @see {@link refineResult} - Refines one concrete variant key.
 * @example
 * ```ts
 * import { refineVariantMap } from '@resultsafe/core-fp-result';
 *
 * const map = {
 *   created: { payload: 'id' },
 *   failed: { payload: 'reason' },
 * } as const;
 *
 * const out = refineVariantMap({ type: 'created', id: '1' }, map, {
 *   created: { id: (x: unknown): x is string => typeof x === 'string' },
 *   failed: { reason: (x: unknown): x is string => typeof x === 'string' },
 * });
 *
 * console.log(out?.type); // created
 * ```
 * @public
 */
export function refineVariantMap<
  TMap extends Record<string, VariantConfig>,
  TValidators extends SyncValidatorMap<TMap>,
>(
  value: unknown,
  variantMap: TMap,
  validators: TValidators,
): SyncRefinedResultUnion<TMap, TValidators> | null {
  if (typeof value !== 'object' || value === null || !('type' in value)) {
    return null;
  }

  const rawType = (value as { type?: unknown }).type;
  if (typeof rawType !== 'string' || !(rawType in variantMap)) return null;

  // fix the specific variant key
  type K = Extract<keyof TMap, string>;
  const k = rawType as K;

  const config = variantMap[k];
  if (!config) return null;

  // payload keys for the specific K
  const payload = config.payload;
  const keys = (
    payload === 'never' ? [] : Array.isArray(payload) ? payload : [payload]
  ) as readonly PayloadKeys<TMap[typeof k]>[];

  // validators aligned with the specific K
  const vvs = validators[k] as
    | Partial<Record<PayloadKeys<TMap[typeof k]>, ValidatorFn>>
    | undefined;

  if (vvs) {
    const obj = value as Record<string, unknown>;
    for (const key of keys) {
      const check = vvs[key];
      if (!check) continue;
      if (!check(obj[key as string])) return null;
    }
  }

  return value as SyncRefinedResultUnion<TMap, TValidators>;
}
