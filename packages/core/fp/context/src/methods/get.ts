// @resultsafe/core-fp-context/src/methods/get.ts

import type { Context } from '@resultsafe/core-fp-context';

export const get = <T>(context: Context, key: string): T | undefined =>
  context[key] as T | undefined;


