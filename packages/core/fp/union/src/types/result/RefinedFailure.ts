// @resultsafe/core-fp-union/src/types/RefinedFailure.ts
import type { VariantConfig } from '../variant/VariantConfig.js';

export type RefinedFailure<TMap extends Record<'failure', VariantConfig>> =
  TMap['failure']['payload'] extends 'never'
    ? { type: 'failure' }
    : TMap['failure']['payload'] extends string
      ? { type: 'failure' } & Record<TMap['failure']['payload'], unknown>
      : { type: 'failure' } & Record<
          TMap['failure']['payload'][number],
          unknown
        >;


