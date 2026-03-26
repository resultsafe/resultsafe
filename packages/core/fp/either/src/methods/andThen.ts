// @resultsafe/core-fp-either/src/methods/andThen.ts

import { isRight, type Either } from '@resultsafe/core-fp-either';

export const andThen = <L, R, U>(
  either: Either<L, R>,
  fn: (right: R) => Either<L, U>,
): Either<L, U> => {
  if (isRight(either)) {
    return fn(either.right);
  }

  return either as Either<L, U>; // ✅ Safe cast: Left<L> is compatible with Either<L, U>
};


