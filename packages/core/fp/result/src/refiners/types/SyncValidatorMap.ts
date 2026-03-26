import type {
  PayloadKeys,
  ValidatorFn,
  VariantConfig,
} from '../../shared-types.js';

/** Описывает наборы валидаторов, сгруппированные по ключу варианта. */
export type SyncValidatorMap<TMap extends Record<string, VariantConfig>> = {
  [K in keyof TMap]?: Partial<Record<PayloadKeys<TMap[K]>, ValidatorFn>>;
};
