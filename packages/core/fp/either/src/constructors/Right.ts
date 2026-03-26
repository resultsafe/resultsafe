// @resultsafe/core-fp-either/src/constructors/Right.ts

import type { Either } from '@resultsafe/core-fp-either';

export const Right = <R, L = never>(value: R): Either<L, R> => ({
  _tag: 'Right',
  right: value,
});


