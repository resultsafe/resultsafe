import { isSome, type Option } from '@resultsafe/core-fp-option-shared';

export const unwrapOrElse = <T>(option: Option<T>, fn: () => T): T =>
  isSome(option) ? option.value : fn();


