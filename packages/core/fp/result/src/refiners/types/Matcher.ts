import type { VariantOf } from './VariantOf.js';

/**
 * Describes the shape of a non-strict builder for variant matching.
 *
 * @typeParam T - The variant union type.
 * @typeParam R - The return type of the match operation.
 *
 * @remarks
 * Unlike {@link MatchBuilder}, this builder allows matching any variant
 * and provides an `otherwise` fallback handler for unmatched cases.
 *
 * @example
 * ```ts
 * import { Matcher } from '@resultsafe/core-fp-result';
 *
 * const matcher: Matcher<MyVariant, string> = {
 *   with: (variant, fn) => matcher,
 *   otherwise: (fn) => ({ run: () => 'default' })
 * };
 * ```
 *
 * @since 0.1.8
 * @public
 */
export type Matcher<T extends VariantOf, R> = {
  readonly with: <K extends T['type']>(
    variant: K,
    fn: (value: Extract<T, { type: K }>) => R,
  ) => Matcher<T, R>;
  readonly otherwise: (fn: (value: T) => R) => { readonly run: () => R };
};
