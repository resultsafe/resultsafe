import type { VariantConfig } from '../../shared-types.js';

import type { SyncRefinedResult } from './SyncRefinedResult.js';
import type { SyncValidatorMap } from './SyncValidatorMap.js';

/** Описывает объединение синхронно уточненных вариантов. */
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


