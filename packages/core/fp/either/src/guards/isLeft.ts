// @resultsafe/core-fp-either/src/guards/isLeft.ts

import { type Either } from '@resultsafe/core-fp-either';

export const isLeft = <L, R>(
  either: Either<L, R>,
): either is { _tag: 'Left'; left: L } => either._tag === 'Left';


