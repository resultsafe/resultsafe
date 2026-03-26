// @resultsafe/core-fp-codec/src/types/InferCodec.ts

import type { Result } from '@resultsafe/core-fp-result';

/**
 * Infers the decoded type T from Codec<T>.
 * Compatible with any Codec returning Result<T, E>.
 */
export type InferCodec<T> = T extends {
  decode: (input: unknown) => Result<infer U, any>;
}
  ? U
  : never;


