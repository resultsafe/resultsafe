// @resultsafe/core-fp-union/src/types/RefinedResult.ts

import type {
  AsyncValidatorFn,
  PayloadKeys,
  ValidatorFn,
  VariantConfig,
} from '@resultsafe/core-fp-union';

// Для асинхронных валидаторов
export type RefinedResultAsync<
  K extends keyof TMap & string,
  TMap extends Record<string, VariantConfig>,
  TValidators extends Partial<Record<PayloadKeys<TMap[K]>, AsyncValidatorFn>>,
> = {
  type: K;
} & Record<PayloadKeys<TMap[K]>, unknown>;

// Для синхронных валидаторов ✅
export type RefinedResult<
  K extends keyof TMap & string,
  TMap extends Record<string, VariantConfig>,
  TValidators extends Partial<Record<PayloadKeys<TMap[K]>, ValidatorFn>>,
> = {
  type: K;
} & Record<PayloadKeys<TMap[K]>, unknown>;

// Универсальный тип для обоих случаев
export type UniversalRefinedResult<
  K extends keyof TMap & string,
  TMap extends Record<string, VariantConfig>,
  TValidators extends Record<string, any>,
> = {
  type: K;
} & Record<string, unknown>;


