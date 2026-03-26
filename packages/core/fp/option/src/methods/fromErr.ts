import { type Option } from '@resultsafe/core-fp-option-shared';
import { isErr, type Result } from '@resultsafe/core-fp-result-shared';
import { None, Some } from '../constructors/index.js';

export const fromErr = <T, E>(result: Result<T, E>): Option<E> =>
  isErr(result) ? Some(result.error) : None;


