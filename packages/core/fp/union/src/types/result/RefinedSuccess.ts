// @resultsafe/core-fp-union/src/types/RefinedSuccess.ts
import type { VariantConfig } from '../variant/VariantConfig.js';

export type RefinedSuccess<TMap extends Record<'success', VariantConfig>> =
  TMap['success']['payload'] extends 'never'
    ? { type: 'success' }
    : TMap['success']['payload'] extends string
      ? { type: 'success' } & Record<TMap['success']['payload'], unknown>
      : { type: 'success' } & Record<
          TMap['success']['payload'][number],
          unknown
        >;


