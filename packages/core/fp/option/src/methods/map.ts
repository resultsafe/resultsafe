import { isSome, type Option } from '@resultsafe/core-fp-option-shared';

export const map = <T, U>(option: Option<T>, fn: (value: T) => U): Option<U> =>
  isSome(option) ? { some: true, value: fn(option.value) } : { some: false };


