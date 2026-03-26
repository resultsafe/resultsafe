// @resultsafe/core-fp-do/src/methods/inspect.ts

import type { Do } from '@resultsafe/core-fp-do';

export const inspect = <T>(_do: Do<T>, fn: (value: T) => void): Do<T> => {
  fn(_do.value);
  return _do;
};


