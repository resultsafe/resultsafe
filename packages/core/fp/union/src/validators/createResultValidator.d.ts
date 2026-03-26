import type { CreateAnyResult, CreateResultShape } from '../types/result/index.js';
import type { ValidatorMap } from '../types/utils/index.js';
import type { ValidationResult, Validator } from '../types/validation/index.js';
import type { VariantConfig } from '../types/variant/VariantConfig.js';
export declare const createResultValidator: <TConfigMap extends Record<string, VariantConfig>>(variantMap: TConfigMap) => {
    readonly isResult: <TValidators extends ValidatorMap<TConfigMap> = {}>(value: unknown, validators?: TValidators) => value is { [K in keyof TValidators & keyof TConfigMap]: TValidators[K] extends Partial<Record<string, Validator<any>>> ? {
        type: K;
    } & Record<string, unknown> : CreateResultShape<K & string, TConfigMap[K]>; }[keyof TValidators & keyof TConfigMap] | CreateAnyResult<TConfigMap>;
} & { [K in keyof TConfigMap as `is${Capitalize<string & K>}`]: <TValidators extends Partial<Record<string, Validator<any>>> = {}>(value: unknown, validators?: TValidators) => value is {
    type: K;
} & Record<string, unknown>; } & {
    readonly validateResult: (value: unknown) => ValidationResult<CreateAnyResult<TConfigMap>>;
    readonly getVariantConfig: <K_1 extends keyof TConfigMap>(variant: K_1) => TConfigMap[K_1] | undefined;
    readonly getSupportedVariants: () => Array<keyof TConfigMap>;
};
//# sourceMappingURL=createResultValidator.d.ts.map