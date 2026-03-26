// @resultsafe/core-fp-union/src/validators/createResultValidator.ts
import type {
  CreateAnyResult,
  CreateResultShape,
} from '../types/result/index.js';
import type { ValidatorMap } from '../types/utils/index.js';
import type { ValidationResult, Validator } from '../types/validation/index.js';
import type { VariantConfig } from '../types/variant/VariantConfig.js';
import { hasOwn, isObject, safeValidate } from '../utils/object/index.js';
import { createError } from './createError.js';
import { createSuccess } from './createSuccess.js';

export const createResultValidator = <
  TConfigMap extends Record<string, VariantConfig>,
>(
  variantMap: TConfigMap,
) => {
  const getVariantConfig = <K extends keyof TConfigMap>(
    variant: K,
  ): TConfigMap[K] | undefined => {
    return hasOwn(variantMap, variant) ? variantMap[variant] : undefined;
  };

  const isValidVariant = (value: unknown): value is keyof TConfigMap => {
    return typeof value === 'string' && hasOwn(variantMap, value);
  };

  const validateStructure = (
    value: unknown,
  ): ValidationResult<Record<string, unknown>> => {
    if (!isObject(value)) {
      return createError('NOT_OBJECT', 'Value must be an object');
    }

    if (!hasOwn(value, 'type')) {
      return createError('MISSING_TYPE', 'Object must have a "type" property');
    }

    if (typeof value['type'] !== 'string') {
      return createError('INVALID_TYPE', 'Type property must be a string');
    }

    return createSuccess(value as Record<string, unknown>);
  };

  const validateVariant = (
    variant: string,
  ): ValidationResult<keyof TConfigMap> => {
    if (!isValidVariant(variant)) {
      return createError('UNKNOWN_VARIANT', `Unknown variant: ${variant}`, {
        variant,
      });
    }
    return createSuccess(variant);
  };

  const validatePayloadFields = <K extends keyof TConfigMap>(
    obj: Record<string, unknown>,
    variant: K,
    config: TConfigMap[K],
  ): ValidationResult<void> => {
    const { payload } = config;

    if (payload === 'never') {
      return createSuccess(undefined);
    }

    const requiredKeys =
      typeof payload === 'string' ? [payload] : (payload as readonly string[]);

    for (const key of requiredKeys) {
      if (!hasOwn(obj, key)) {
        return createError('MISSING_FIELD', `Missing required field: ${key}`, {
          field: key,
          variant: String(variant),
        });
      }
    }

    return createSuccess(undefined);
  };

  const validateForbiddenFields = <K extends keyof TConfigMap>(
    obj: Record<string, unknown>,
    config: TConfigMap[K],
  ): ValidationResult<void> => {
    if (config.forbidden && hasOwn(obj, config.forbidden)) {
      return createError(
        'FORBIDDEN_FIELD',
        `Forbidden field present: ${config.forbidden}`,
        { field: config.forbidden },
      );
    }
    return createSuccess(undefined);
  };

  const validateStrictFields = <K extends keyof TConfigMap>(
    obj: Record<string, unknown>,
    config: TConfigMap[K],
  ): ValidationResult<void> => {
    if (!config.strictFields) {
      return createSuccess(undefined);
    }

    const allowedFields = new Set<string>(['type']);

    if (config.forbidden) {
      allowedFields.add(config.forbidden);
    }

    if (config.payload !== 'never') {
      const payloadKeys =
        typeof config.payload === 'string' ? [config.payload] : config.payload;
      payloadKeys.forEach((key) => allowedFields.add(key));
    }

    const extraFields = Object.keys(obj).filter(
      (key) => !allowedFields.has(key),
    );

    if (extraFields.length > 0) {
      const firstField = extraFields[0];
      if (firstField !== undefined) {
        return createError(
          'UNEXPECTED_FIELD',
          `Unexpected fields: ${extraFields.join(', ')}`,
          { field: firstField },
        );
      }
      return createError(
        'UNEXPECTED_FIELD',
        `Unexpected fields: ${extraFields.join(', ')}`,
      );
    }

    return createSuccess(undefined);
  };

  const validateWithValidators = <K extends keyof TConfigMap>(
    obj: Record<string, unknown>,
    variant: K,
    validators?: Partial<Record<string, Validator<any>>>,
  ): ValidationResult<void> => {
    if (!validators) {
      return createSuccess(undefined);
    }

    for (const [key, validator] of Object.entries(validators) as Array<
      [string, Validator<any>]
    >) {
      if (hasOwn(obj, key) && validator) {
        if (!safeValidate(validator, obj[key])) {
          return createError(
            'VALIDATION_FAILED',
            `Validation failed for field: ${key}`,
            { field: key, variant: String(variant) },
          );
        }
      }
    }

    return createSuccess(undefined);
  };

  const validateCommon = <K extends keyof TConfigMap>(
    obj: Record<string, unknown>,
    variant: K,
    config: TConfigMap[K],
    validators?: Partial<Record<string, Validator<any>>>,
  ): ValidationResult<void> => {
    const payloadResult = validatePayloadFields(obj, variant, config);
    if (!payloadResult.success) return payloadResult;

    const forbiddenResult = validateForbiddenFields(obj, config);
    if (!forbiddenResult.success) return forbiddenResult;

    const strictResult = validateStrictFields(obj, config);
    if (!strictResult.success) return strictResult;

    const validatorsResult = validateWithValidators(obj, variant, validators);
    if (!validatorsResult.success) return validatorsResult;

    return createSuccess(undefined);
  };

  const isResult = <TValidators extends ValidatorMap<TConfigMap> = {}>(
    value: unknown,
    validators?: TValidators,
  ): value is
    | {
        [K in keyof TValidators &
          keyof TConfigMap]: TValidators[K] extends Partial<
          Record<string, Validator<any>>
        >
          ? {
              type: K;
            } & Record<string, unknown>
          : CreateResultShape<K & string, TConfigMap[K]>;
      }[keyof TValidators & keyof TConfigMap]
    | CreateAnyResult<TConfigMap> => {
    const structureResult = validateStructure(value);
    if (!structureResult.success) return false;

    const obj = structureResult.data;
    const variantResult = validateVariant(obj['type'] as string);
    if (!variantResult.success) return false;

    const variant = variantResult.data;
    const config = getVariantConfig(variant)!;

    const commonResult = validateCommon(
      obj,
      variant,
      config,
      validators?.[variant] as any,
    );

    return commonResult.success;
  };

  const createVariantPredicates = () => {
    const predicates = {} as Record<string, any>;

    for (const variant of Object.keys(variantMap) as Array<keyof TConfigMap>) {
      const predicateName = `is${String(variant).charAt(0).toUpperCase()}${String(variant).slice(1)}`;

      predicates[predicateName] = <
        TValidators extends Partial<Record<string, Validator<any>>> = {},
      >(
        value: unknown,
        validators?: TValidators,
      ): value is {
        type: typeof variant;
      } & Record<string, unknown> => {
        const structureResult = validateStructure(value);
        if (!structureResult.success) return false;

        const obj = structureResult.data;
        if (obj['type'] !== variant) return false;

        const config = getVariantConfig(variant);
        if (!config) return false;

        const commonResult = validateCommon(obj, variant, config, validators);
        return commonResult.success;
      };
    }

    return predicates as {
      [K in keyof TConfigMap as `is${Capitalize<string & K>}`]: <
        TValidators extends Partial<Record<string, Validator<any>>> = {},
      >(
        value: unknown,
        validators?: TValidators,
      ) => value is {
        type: K;
      } & Record<string, unknown>;
    };
  };

  return {
    isResult,
    ...createVariantPredicates(),
    validateResult: (
      value: unknown,
    ): ValidationResult<CreateAnyResult<TConfigMap>> => {
      const structureResult = validateStructure(value);
      if (!structureResult.success) return structureResult;

      const obj = structureResult.data;
      const variantResult = validateVariant(obj['type'] as string);
      if (!variantResult.success) return variantResult;

      const variant = variantResult.data;
      const config = getVariantConfig(variant)!;

      const commonResult = validateCommon(obj, variant, config);
      if (!commonResult.success) return commonResult;

      return createSuccess(obj as CreateAnyResult<TConfigMap>);
    },
    getVariantConfig,
    getSupportedVariants: () =>
      Object.keys(variantMap) as Array<keyof TConfigMap>,
  } as const;
};


