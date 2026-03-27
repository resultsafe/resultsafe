import type { VariantOf } from './VariantOf.js';

/**
 * Describes a handler entry for variant matching in internal matcher mechanisms.
 *
 * @typeParam K - The variant key type.
 * @typeParam T - The variant union type.
 * @typeParam R - The return type of the handler function.
 *
 * @internal
 */
export type Handler<K extends string, T extends VariantOf<K>, R> = {
  readonly variant: K;
  readonly fn: (value: Extract<T, { type: K }>) => R;
};
