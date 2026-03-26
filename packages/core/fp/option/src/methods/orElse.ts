import { isNone, type Option } from '@resultsafe/core-fp-option-shared';

export const orElse = <T>(option: Option<T>, fn: () => Option<T>): Option<T> =>
  isNone(option) ? fn() : option;


