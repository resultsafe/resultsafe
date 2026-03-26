import type { RefinedResult } from '../types/result/RefinedResult.js';
import type { PayloadKeys } from '../types/utils/PayloadKeys.js';
import type { AsyncValidatorFn } from '../types/validation/AsyncValidatorFn.js';
import type { VariantConfig } from '../types/variant/VariantConfig.js';
export declare const refineAsyncResult: <const TMap extends Record<string, VariantConfig>, const K extends keyof TMap & string, const TValidators extends Partial<Record<PayloadKeys<TMap[K]>, AsyncValidatorFn>>>(value: unknown, variant: K, variantMap: TMap, validators: TValidators) => Promise<RefinedResult<K, TMap, TValidators> | null>;
//# sourceMappingURL=refineAsyncResult.d.ts.map