// @resultsafe/core-fp-union/src/types/CreateResultShape.ts

import type { ExcludeField } from '../utils/ExcludeField.js';
import type { ExtractPayloadKeys } from '../utils/ExtractPayloadKeys.js';
import type { Validator } from '../validation/Validator.js';
import type { VariantConfig } from '../variant/VariantConfig.js';

export type CreateResultShape<
  TVariant extends string,
  TConfig extends VariantConfig,
  TPayloadKeys extends readonly string[] = ExtractPayloadKeys<TConfig>,
> = Readonly<{
  type: TVariant;
}> &
  (TConfig['payload'] extends 'never'
    ? {}
    : Record<TPayloadKeys[number], unknown>) &
  ExcludeField<TConfig['forbidden']>;

type RefineResult<
  TVariant extends string,
  TConfig extends VariantConfig,
  TValidators extends Partial<Record<string, Validator<any>>>,
> = CreateResultShape<TVariant, TConfig> & {
  readonly [K in keyof TValidators & string]: TValidators[K] extends Validator<
    infer T
  >
    ? T
    : unknown;
};


