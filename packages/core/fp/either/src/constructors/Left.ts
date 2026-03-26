// @resultsafe/core-fp-either/src/constructors/Left.ts

import type { Either } from '@resultsafe/core-fp-either';

export const Left = <L, R = never>(value: L): Either<L, R> => ({
  _tag: 'Left',
  left: value,
});


