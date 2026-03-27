import type { VariantOf } from './VariantOf.js';

/**
 * Describes the shape of a strict builder for variant matching.
 *
 * @typeParam T - The variant union type.
 * @typeParam R - The return type of the match operation.
 * @typeParam Handled - The union of already handled variant types.
 *
 * @example
 * ```ts
 * import { MatchBuilder } from '@resultsafe/core-fp-result';
 *
 * const builder: MatchBuilder<MyVariant, string> = {
 *   with: (variant, fn) => builder,
 *   run: () => 'result'
 * };
 * ```
 *
 * @since 0.1.8
 * @public
 */
export type MatchBuilder<
  T extends VariantOf,
  R,
  Handled extends T['type'] = never,
> = {
  readonly with: <K extends Exclude<T['type'], Handled>>(
    variant: K,
    fn: (value: Extract<T, { type: K }>) => R,
  ) => MatchBuilder<T, R, Handled | K>;
  readonly run: Handled extends T['type'] ? () => R : never;
};
