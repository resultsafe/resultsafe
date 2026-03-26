/**
 * An asynchronous validator function that checks if a value is valid.
 *
 * @param value - The value to validate.
 * @returns A promise that resolves to `true` if valid, `false` otherwise.
 *
 * @example
 * ```ts
 * import { AsyncValidatorFn } from '@resultsafe/core-fp-result';
 *
 * const isValidId: AsyncValidatorFn = async (value) => {
 *   // Simulate async database check
 *   return typeof value === 'string' && value.length > 0;
 * };
 * ```
 *
 * @since 0.1.8
 * @public
 */
export type AsyncValidatorFn = (value: unknown) => Promise<boolean>;
