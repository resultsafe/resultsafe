import type { Result } from '../types/Result.js';

export declare const isErrAnd: <T, E>(
  result: Result<T, E>,
  predicate: (error: E) => boolean,
) => boolean;
