import type { PayloadKeys } from '../../types/refiners/PayloadKeys.js';
import type { ValidatorFn } from '../../types/refiners/ValidatorFn.js';
import type { VariantConfig } from '../../types/refiners/VariantConfig.js';

/**
 * Describes validator sets grouped by variant key.
 *
 * @typeParam TMap - The variant configuration map.
 *
 * @remarks
 * This type maps each variant to its optional validators for payload fields.
 * Validators are used to refine and check variant data at runtime.
 *
 * @example
 * ```ts
 * import { SyncValidatorMap, VariantConfig } from '@resultsafe/core-fp-result';
 *
 * type Validators = SyncValidatorMap<{
 *   user: { payload: 'name' | 'age' };
 *   error: { payload: 'code' };
 * }>;
 * // { user?: { name?: ValidatorFn; age?: ValidatorFn }; error?: { code?: ValidatorFn } }
 * ```
 *
 * @since 0.1.8
 * @public
 */
export type SyncValidatorMap<TMap extends Record<string, VariantConfig>> = {
  [K in keyof TMap]?: Partial<Record<PayloadKeys<TMap[K]>, ValidatorFn>>;
};
