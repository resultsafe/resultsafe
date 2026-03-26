import { type Option } from '@resultsafe/core-fp-option-shared';
import { isOk, type Result } from '@resultsafe/core-fp-result-shared';
import { None, Some } from '../constructors/index.js';

export const fromOk = <T, E>(result: Result<T, E>): Option<T> =>
  isOk(result) ? Some(result.value) : None;


