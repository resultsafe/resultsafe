// @resultsafe/core-fp-either/src/guards/isRightAnd.ts

import { isRight, type Either } from '@resultsafe/core-fp-either';

export const isRightAnd = <L, R>(
  either: Either<L, R>,
  predicate: (right: R) => boolean,
): boolean => isRight(either) && predicate(either.right);


