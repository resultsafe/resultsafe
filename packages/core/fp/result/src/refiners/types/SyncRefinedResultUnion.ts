import type { VariantConfig } from '../../shared-types.js';
import type { SyncRefinedResult } from './SyncRefinedResult.js';
import type { SyncValidatorMap } from './SyncValidatorMap.js';

/**
 * Describes a union of synchronously refined variants.
 *
 * @typeParam TMap - The variant configuration map.
 * @typeParam TValidators - The validator map for all variants.
 *
 * @remarks
 * This type represents the union of all refined variants in the map.
 * Each variant is refined using {@link SyncRefinedResult}.
 *
 * @example
 * ```ts
 * import { SyncRefinedResultUnion, VariantConfig } from '@resultsafe/core-fp-result';
 *
 * type Variants = SyncRefinedResultUnion<
 *   { user: { payload: 'name' }; error: { payload: 'code' } },
 *   {}
 * >;
 * // { type: 'user'; name: unknown } | { type: 'error'; code: unknown }
 * ```
 *
 * @since 0.1.8
 * @public
 */
export type SyncRefinedResultUnion<
  TMap extends Record<string, VariantConfig>,
  TValidators extends SyncValidatorMap<TMap>,
> = {
  [K in keyof TMap & string]: SyncRefinedResult<
    K,
    TMap,
    NonNullable<TValidators[K]>
  >;
}[keyof TMap & string];
