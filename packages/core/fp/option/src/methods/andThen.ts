import { type Option, isSome } from '@resultsafe/core-fp-option-shared';

export const andThen = <T, U>(
  option: Option<T>,
  fn: (value: T) => Option<U>,
): Option<U> => (isSome(option) ? fn(option.value) : (option as Option<U>));


