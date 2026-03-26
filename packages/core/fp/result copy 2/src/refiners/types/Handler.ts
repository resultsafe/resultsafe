import type { VariantOf } from './VariantOf.js';

/** Описывает запись обработчика варианта во внутренних механизмах matcher. @internal */
export type Handler<K extends string, T extends VariantOf<K>, R> = {
  readonly variant: K;
  readonly fn: (value: Extract<T, { type: K }>) => R;
};
