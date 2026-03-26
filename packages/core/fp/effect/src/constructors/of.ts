// @resultsafe/core-fp-effect/src/constructors/of.ts

import type { Effect } from '@resultsafe/core-fp-effect';
import { ok } from '@resultsafe/core-fp-result';

export const of =
  <R, T, E = never>(value: T): Effect<R, E, T> =>
  () =>
    Promise.resolve(ok(value));


