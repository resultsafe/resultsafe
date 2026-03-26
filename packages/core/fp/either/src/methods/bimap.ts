// @resultsafe/core-fp-either/src/methods/bimap.ts

import { type Either } from '@resultsafe/core-fp-either';

export const bimap = <L, R, M, U>(
  either: Either<L, R>,
  leftFn: (left: L) => M,
  rightFn: (right: R) => U,
): Either<M, U> => {
  if (either._tag === 'Left') {
    return { _tag: 'Left', left: leftFn(either.left) };
  }

  return { _tag: 'Right', right: rightFn(either.right) };
};


