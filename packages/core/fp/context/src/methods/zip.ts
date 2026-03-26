// @resultsafe/core-fp-context/src/methods/zip.ts

import type { Context } from '@resultsafe/core-fp-context';

export const zip = (context1: Context, context2: Context): Context => ({
  ...context1,
  ...context2,
});


