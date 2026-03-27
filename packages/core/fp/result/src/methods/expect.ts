import { isOk } from '../guards/isOk.js';
import { type Result } from '../types/core/index.js';

/**
 * Returns the success value or throws an exception with a custom message.
 *
 * @typeParam T - The success value type.
 * @typeParam E - The error value type.
 * @param result - The source `Result`.
 * @param msg - The error message used when `result` is `Err`.
 * @returns The unwrapped success value.
 * @throws Error - Throws an exception when `result` is `Err`.
 * @since 0.1.0
 * @see {@link expectErr} - Symmetric helper for the error branch.
 * @example
 * ```ts
 * import { Ok, expect } from '@resultsafe/core-fp-result';
 *
 * const value = expect(Ok(5), 'must be ok');
 * console.log(value); // 5
 * ```
 * @public
 */
export const expect = <T, E>(result: Result<T, E>, msg: string): T => {
  if (isOk(result)) {
    return result.value;
  }
  throw new Error(msg);
};
