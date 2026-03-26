// @resultsafe/core-fp-do/src/constructors/createDo.ts

import type { Do } from '@resultsafe/core-fp-do';

export const createDo = <T>(value: T): Do<T> => ({
  _tag: 'Do',
  value,
});


