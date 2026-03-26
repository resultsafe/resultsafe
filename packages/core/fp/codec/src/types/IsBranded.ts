// @resultsafe/core-fp-codec/src/types/IsBranded.ts

import type { __Brand, Branded } from './Branded.js';

/**
 * Checks if a type is branded and extracts the brand.
 * If not branded — returns the original type.
 */
export type IsBranded<T> = T extends {
  readonly [__Brand]: infer B;
}
  ? B extends string
    ? Branded<T, B>
    : never
  : T;


