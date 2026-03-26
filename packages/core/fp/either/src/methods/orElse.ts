// @resultsafe/core-fp-either/src/methods/orElse.ts

import { type Either } from '@resultsafe/core-fp-either';

export const orElse = <L, R, M>(
  either: Either<L, R>,
  fn: (left: L) => Either<M, R>,
): Either<M, R> => {
  if (either._tag === 'Left') {
    return fn(either.left);
  }

  return { _tag: 'Right', right: either.right };
};


