// @resultsafe/core-fp-context/src/constructors/createContext.ts

import type { Context } from '@resultsafe/core-fp-context';

export const createContext = <T extends Record<string, unknown>>(
  context: T,
): Context => context;


