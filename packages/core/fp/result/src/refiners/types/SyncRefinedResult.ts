import type {
  PayloadKeys,
  ValidatorFn,
  VariantConfig,
} from '../../shared-types.js';

/** Описывает синхронно уточненное конкретное значение варианта. */
export type SyncRefinedResult<
  K extends keyof TMap & string,
  TMap extends Record<string, VariantConfig>,
  _TValidators extends Partial<Record<PayloadKeys<TMap[K]>, ValidatorFn>>,
> = {
  type: K;
} & Record<PayloadKeys<TMap[K]>, unknown>;
