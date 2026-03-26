import type { Result } from '../types/Result.js';

export declare const isErr: <T, E>(
  result: Result<T, E>,
) => result is { ok: false; error: E };
