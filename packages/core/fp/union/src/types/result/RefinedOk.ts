// @resultsafe/core-fp-union/src/types/RefinedOk.ts
import type { VariantConfig } from '../variant/VariantConfig.js';

export type RefinedOk<TMap extends Record<'ok', VariantConfig>> =
  TMap['ok']['payload'] extends 'never'
    ? { type: 'ok' }
    : TMap['ok']['payload'] extends string
      ? { type: 'ok' } & Record<TMap['ok']['payload'], unknown>
      : { type: 'ok' } & Record<TMap['ok']['payload'][number], unknown>;


