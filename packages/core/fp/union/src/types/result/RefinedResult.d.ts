import type { PayloadKeys } from '../utils/PayloadKeys.js';
import type { AsyncValidatorFn } from '../validation/AsyncValidatorFn.js';
import type { VariantConfig } from '../variant/VariantConfig.js';
export type RefinedResult<K extends keyof TMap & string, TMap extends Record<string, VariantConfig>, TValidators extends Partial<Record<PayloadKeys<TMap[K]>, AsyncValidatorFn>>> = {
    type: K;
} & Record<PayloadKeys<TMap[K]>, unknown>;
//# sourceMappingURL=RefinedResult.d.ts.map