import type { VariantOf } from './VariantOf.js';

/** Описывает форму строгого builder для matcher. */
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
