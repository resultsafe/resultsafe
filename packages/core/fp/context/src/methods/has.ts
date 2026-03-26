// @resultsafe/core-fp-context/src/methods/has.ts

import type { Context } from '@resultsafe/core-fp-context';

export const has = (context: Context, key: string): boolean => key in context;


