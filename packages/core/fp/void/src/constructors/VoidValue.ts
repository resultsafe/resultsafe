// @resultsafe/core-fp-void/src/constructors/index.ts

import type { Void } from '@resultsafe/core-fp-void';

export const VoidValue: Void = { _tag: 'Void' } as const satisfies {
  readonly _tag: 'Void';
};


