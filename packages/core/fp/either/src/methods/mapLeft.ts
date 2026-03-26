// @resultsafe/core-fp-either/src/methods/mapLeft.ts

import { type Either } from '@resultsafe/core-fp-either';

export const mapLeft = <L, R, M>(
  either: Either<L, R>,
  fn: (left: L) => M,
): Either<M, R> => {
  if (either._tag === 'Left') {
    return { _tag: 'Left', left: fn(either.left) };
  }
  return { _tag: 'Right', right: either.right };
};


