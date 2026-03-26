// @resultsafe/core-fp-codec/src/types/InferFull.ts

import type { Result } from '@resultsafe/core-fp-result';
import type { IsBranded } from './IsBranded.js';

/**
 * Deep inference — preserves brands, refinements, and structure.
 * Unlike InferCodec, it maintains nominal typing.
 */
export type InferFull<T> = T extends {
  decode: (input: unknown) => Result<infer U, any>;
}
  ? IsBranded<U>
  : never;


