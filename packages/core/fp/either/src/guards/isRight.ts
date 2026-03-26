// @resultsafe/core-fp-either/src/guards/isRight.ts

import { type Either } from '@resultsafe/core-fp-either';

export const isRight = <L, R>(
  either: Either<L, R>,
): either is { _tag: 'Right'; right: R } => either._tag === 'Right';


