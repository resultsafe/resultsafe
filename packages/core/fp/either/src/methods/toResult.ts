// @resultsafe/core-fp-either/src/methods/toResult.ts

import type { Either } from '@resultsafe/core-fp-either';
import { err, ok, type Result } from '@resultsafe/core-fp-result';

export const toResult = <L, R>(either: Either<L, R>): Result<R, L> => {
  if (either._tag === 'Left') {
    return err(either.left);
  }

  return ok(either.right);
};


