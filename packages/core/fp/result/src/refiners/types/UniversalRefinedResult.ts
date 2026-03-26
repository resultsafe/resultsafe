import type { VariantConfig } from '../../shared-types.js';

/** Описывает обобщенное синхронно уточненное значение варианта. */
export type UniversalRefinedResult<
  K extends keyof TMap & string,
  TMap extends Record<string, VariantConfig>,
  _TValidators extends Record<string, unknown>,
> = {
  type: K;
} & Record<string, unknown>;
