// @resultsafe/core-fp-context/src/methods/set.ts

import type { Context } from '@resultsafe/core-fp-context';

export const set = <T>(context: Context, key: string, value: T): Context => ({
  ...context,
  [key]: value,
});


