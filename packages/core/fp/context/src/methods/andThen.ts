// @resultsafe/core-fp-context/src/methods/andThen.ts

import type { Context } from '@resultsafe/core-fp-context';

export const andThen = <T, U>(
  context: Context,
  key: string,
  fn: (value: T) => Context,
): Context => {
  const value = context[key] as T;
  return fn(value);
};


