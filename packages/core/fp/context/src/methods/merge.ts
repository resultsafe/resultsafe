// @resultsafe/core-fp-context/src/methods/merge.ts

import type { Context } from '@resultsafe/core-fp-context';

export const merge = (context1: Context, context2: Context): Context => ({
  ...context1,
  ...context2,
});


