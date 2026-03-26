// @resultsafe/core-fp-either/src/methods/map.ts

import { type Either } from '@resultsafe/core-fp-either';

export const map = <L, R, U>(
  either: Either<L, R>,
  fn: (right: R) => U,
): Either<L, U> => {
  if (either._tag === 'Right') {
    return { _tag: 'Right', right: fn(either.right) };
  }

  return { _tag: 'Left', left: either.left };
};


