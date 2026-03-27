/**
 * Represents the result of an operation that can either succeed with a
 * value of type `T` or fail with an error of type `E`.
 *
 * @summary
 * Represents the result of an operation that can either succeed with a
 * value of type `T` or fail with an error of type `E`.
 *
 * @remarks
 * `Result` is the core type of this library. Pattern match on the `ok`
 * field to narrow the union, then access `value` or `error` safely.
 *
 * Unlike exceptions, `Result` makes the failure path explicit in the
 * type signature, forcing the caller to handle both outcomes.
 *
 * @typeParam T - The type of the success value.
 * @typeParam E - The type of the error.
 *
 * @example
 * ```ts
 * import { Result, Ok, Err } from '@resultsafe/core-fp-result';
 *
 * function divide(a: number, b: number): Result<number, string> {
 *   if (b === 0) return Err("Division by zero");
 *   return Ok(a / b);
 * }
 *
 * const result = divide(10, 2);
 *
 * if (result.ok) {
 *   console.log(result.value); // 5
 * } else {
 *   console.error(result.error);
 * }
 * ```
 *
 * @since 0.1.8
 * @public
 */
export type Result<T, E> =
  | { readonly ok: true; readonly value: T }
  | { readonly ok: false; readonly error: E };

/**
 * Represents an optional value that can either contain a value of type `T`
 * or be empty.
 *
 * @summary
 * Represents an optional value that can either contain a value of type `T`
 * or be empty.
 *
 * @remarks
 * `Option` is used to represent the presence or absence of a value. It is
 * an alternative to `null` or `undefined` that is type-safe and explicit.
 *
 * @typeParam T - The type of the contained value.
 *
 * @example
 * ```ts
 * import { Option } from '@resultsafe/core-fp-result';
 *
 * const someValue: Option<number> = { some: true, value: 42 };
 * const noValue: Option<number> = { some: false };
 * ```
 *
 * @since 0.1.8
 * @public
 */
export type Option<T> =
  | { readonly some: true; readonly value: T }
  | { readonly some: false };

/**
 * Configuration options for variant validation.
 *
 * @remarks
 * Used to configure how variants are validated, including payload keys
 * and field strictness.
 *
 * @example
 * ```ts
 * import { VariantConfig } from '@resultsafe/core-fp-result';
 *
 * const config: VariantConfig = {
 *   payload: ['name', 'age'],
 *   forbidden: 'id',
 *   strictFields: true
 * };
 * ```
 *
 * @since 0.1.8
 * @public
 */
export interface VariantConfig {
  readonly payload: 'never' | string | readonly string[];
  readonly forbidden?: string | undefined;
  readonly strictFields?: boolean | undefined;
}

/**
 * Extracts the payload keys from a `VariantConfig`.
 *
 * @typeParam T - The `VariantConfig` type to extract keys from.
 * @returns The union of payload keys, or `never` if payload is `'never'`.
 *
 * @example
 * ```ts
 * import { PayloadKeys, VariantConfig } from '@resultsafe/core-fp-result';
 *
 * type Config = { payload: 'name' | 'age'; forbidden?: string };
 * type Keys = PayloadKeys<Config>; // 'name' | 'age'
 * ```
 *
 * @since 0.1.8
 * @public
 */
export type PayloadKeys<T extends VariantConfig> = T['payload'] extends 'never'
  ? never
  : T['payload'] extends string
    ? T['payload']
    : T['payload'] extends readonly string[]
      ? T['payload'][number]
      : never;

/**
 * A synchronous validator function that checks if a value is of a specific type.
 *
 * @typeParam T - The type the validator checks for.
 * @param x - The value to validate.
 * @returns `true` if `x` is of type `T`, `false` otherwise.
 *
 * @example
 * ```ts
 * import { ValidatorFn } from '@resultsafe/core-fp-result';
 *
 * const isNumber: ValidatorFn<number> = (x): x is number =>
 *   typeof x === 'number';
 *
 * console.log(isNumber(42)); // true
 * console.log(isNumber('42')); // false
 * ```
 *
 * @since 0.1.8
 * @public
 */
export type ValidatorFn<T = unknown> = (x: unknown) => x is T;

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
