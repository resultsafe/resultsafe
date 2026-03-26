import type { RefinedVariant } from '../types/result/RefinedVariant.js';
import type { PayloadValidator } from '../types/validation/PayloadValidator.js';
import type { VariantConfig } from '../types/variant/VariantConfig.js';
export declare const isVariantAnd: <TMap extends Record<string, VariantConfig>>(variantMap: TMap) => <K extends keyof TMap & string, TExtra extends object = {}>(variant: K, and: (v: RefinedVariant<TMap, K>) => v is RefinedVariant<TMap, K> & TExtra, validators?: PayloadValidator<TMap[K]>) => (value: unknown) => value is RefinedVariant<TMap, K> & TExtra;
//# sourceMappingURL=isVariantAnd.d.ts.map