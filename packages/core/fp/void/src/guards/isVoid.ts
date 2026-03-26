// @resultsafe/core-fp-void/src/guards/isVoid.ts

import type { Void } from '@resultsafe/core-fp-void';

export const isVoid = (value: unknown): value is Void =>
  typeof value === 'object' &&
  value !== null &&
  '_tag' in value &&
  value._tag === 'Void';


