// @resultsafe/core-fp-context/src/methods/delete.ts

import type { Context } from '@resultsafe/core-fp-context';

export const deleteKey = (context: Context, key: string): Context => {
  const { [key]: _, ...rest } = context;
  return rest;
};


