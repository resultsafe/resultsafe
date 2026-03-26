// @resultsafe/core-fp-context/src/methods/provideSome.ts

import type { Context } from '@resultsafe/core-fp-context';

export const provideSome = (
  context: Context,
  partial: Partial<Context>,
): Context => ({
  ...context,
  ...partial,
});


