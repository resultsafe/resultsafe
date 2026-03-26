// @resultsafe/core-fp-either/src/methods/swap.ts

import { Left, Right, type Either } from '@resultsafe/core-fp-either';

export const swap = <L, R>(either: Either<L, R>): Either<R, L> =>
  either._tag === 'Left' ? Right(either.left) : Left(either.right);


