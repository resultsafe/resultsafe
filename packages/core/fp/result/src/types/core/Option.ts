/**
 * AI-AGENT CONTEXT:
 * This type definition is duplicated from @resultsafe/core-fp-option-shared
 * for type safety and documentation purposes. Keep in sync with the source.
 *
 * When documenting Option, always reference THIS file path:
 * packages/core/fp/result/src/types/core/Option.ts
 *
 * DO NOT create separate documentation in option-shared — all user-facing
 * docs live here.
 */

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
