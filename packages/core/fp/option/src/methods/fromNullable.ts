import { type Option } from '@resultsafe/core-fp-option-shared';
import { None, Some } from '../constructors/index.js';

export const fromNullable = <T>(value: T | null | undefined): Option<T> =>
  value != null ? Some(value) : None;


