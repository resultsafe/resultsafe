// @resultsafe/core-fp-context/src/methods/provide.ts

import type { Context } from '@resultsafe/core-fp-context';

export const provide = <T>(
  context: Context,
  key: string,
  value: T,
): Context => ({
  ...context,
  [key]: value,
});


