import type { Result } from '../types/Result.js';

export declare const isOk: <T, E>(
  result: Result<T, E>,
) => result is { ok: true; value: T };
