// @resultsafe/core-fp-union/src/types/RefinedErr.ts
import type { VariantConfig } from '../variant/VariantConfig.js';

export type RefinedErr<TMap extends Record<'err', VariantConfig>> =
  TMap['err']['payload'] extends 'never'
    ? { type: 'err' }
    : TMap['err']['payload'] extends string
      ? { type: 'err' } & Record<TMap['err']['payload'], unknown>
      : { type: 'err' } & Record<TMap['err']['payload'][number], unknown>;


