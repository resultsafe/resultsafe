// @resultsafe/core-fp-union/src/types/VariantShape.ts
import type { PayloadKeys } from '../utils/PayloadKeys.js';
import type { VariantConfig } from './VariantConfig.js';

export type VariantShape<
  TMap extends Record<string, VariantConfig>,
  K extends keyof TMap & string,
> = {
  type: K;
} & (PayloadKeys<TMap[K]> extends never
  ? {}
  : Record<PayloadKeys<TMap[K]>, unknown>);


