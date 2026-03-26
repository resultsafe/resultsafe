// @resultsafe/core-fp-context/src/methods/pick.ts

import type { Context } from '@resultsafe/core-fp-context';

export const pick = (context: Context, keys: readonly string[]): Context => {
  const result: Context = {};
  for (const key of keys) {
    if (key in context) {
      result[key] = context[key];
    }
  }
  return result;
};


