import type { VariantConfig } from '../../shared-types.js';

/** Описывает обобщенное асинхронно уточненное значение варианта. */
export type UniversalAsyncRefinedResult<
  K extends keyof TMap & string,
  TMap extends Record<string, VariantConfig>,
  _TValidators extends Record<string, unknown>,
> = {
  type: K;
} & Record<string, unknown>;


