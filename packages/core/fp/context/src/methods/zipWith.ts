// @resultsafe/core-fp-context/src/methods/zipWith.ts

import type { Context } from '@resultsafe/core-fp-context';

export const zipWith = <T, U, R>(
  context1: Context,
  context2: Context,
  fn: (value1: T, value2: U) => R,
): Context => {
  const keys = new Set([...Object.keys(context1), ...Object.keys(context2)]);
  const result: Context = {};

  for (const key of keys) {
    const value1 = context1[key] as T;
    const value2 = context2[key] as U;
    result[key] = fn(value1, value2);
  }

  return result;
};


