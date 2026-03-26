// @resultsafe/core-fp-context/src/methods/omit.ts

import type { Context } from '@resultsafe/core-fp-context';

export const omit = (context: Context, keys: readonly string[]): Context => {
  const result = { ...context };
  for (const key of keys) {
    delete result[key];
  }
  return result;
};


