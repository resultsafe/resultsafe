// @resultsafe/core-fp-either/src/guards/isLeftAnd.ts

import { isLeft, type Either } from '@resultsafe/core-fp-either';

export const isLeftAnd = <L, R>(
  either: Either<L, R>,
  predicate: (left: L) => boolean,
): boolean => isLeft(either) && predicate(either.left);


