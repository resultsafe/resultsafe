import { type Option, isSome } from '@resultsafe/core-fp-option-shared';

export const isSomeAnd = <T>(
  option: Option<T>,
  predicate: (value: T) => boolean,
): boolean => isSome(option) && predicate(option.value);


