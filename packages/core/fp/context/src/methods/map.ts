// @resultsafe/core-fp-context/src/methods/map.ts

import type { Context } from '@resultsafe/core-fp-context';

export const map = <T, U>(
  context: Context,
  key: string,
  fn: (value: T) => U,
): Context => ({
  ...context,
  [key]: fn(context[key] as T),
});


