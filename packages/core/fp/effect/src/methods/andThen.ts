// @resultsafe/core-fp-effect/src/methods/andThen.ts

import type { Effect } from '@resultsafe/core-fp-effect';

export const andThen =
  <R, E, T, U>(
    effect: Effect<R, E, T>,
    fn: (value: T) => Effect<R, E, U>,
  ): Effect<R, E, U> =>
  (context) =>
    effect(context).then(
      (result) =>
        result.ok
          ? fn(result.value)(context) // возвращает Promise<Result<U, E>>
          : Promise.resolve(result), // возвращаем Err как промис
    );


