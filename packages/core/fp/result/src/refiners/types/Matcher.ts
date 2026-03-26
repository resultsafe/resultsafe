import type { VariantOf } from './VariantOf.js';

/** Описывает форму нестрогого builder для matcher. */
export type Matcher<T extends VariantOf, R> = {
  readonly with: <K extends T['type']>(
    variant: K,
    fn: (value: Extract<T, { type: K }>) => R,
  ) => Matcher<T, R>;
  readonly otherwise: (fn: (value: T) => R) => { readonly run: () => R };
};
