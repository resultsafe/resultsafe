// @resultsafe/core-fp-union/src/types/ExtractPayloadKeys.ts

import type { VariantConfig } from '../variant/VariantConfig.js';

export type ExtractPayloadKeys<TConfig extends VariantConfig> =
  TConfig['payload'] extends 'never'
    ? readonly never[]
    : TConfig['payload'] extends string
      ? readonly [TConfig['payload']]
      : TConfig['payload'] extends readonly string[]
        ? TConfig['payload']
        : readonly never[];


