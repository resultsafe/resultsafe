import { isSome, type Option } from '@resultsafe/core-fp-option-shared';

export const unwrapOr = <T>(option: Option<T>, defaultValue: T): T =>
  isSome(option) ? option.value : defaultValue;


