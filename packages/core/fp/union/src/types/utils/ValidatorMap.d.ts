import type { PayloadValidator } from '../validation/PayloadValidator.js';
import type { VariantConfig } from '../variant/VariantConfig.js';
export type ValidatorMap<TMap extends Record<string, VariantConfig>> = Partial<{
    [K in keyof TMap]: PayloadValidator<TMap[K]>;
}>;
//# sourceMappingURL=ValidatorMap.d.ts.map