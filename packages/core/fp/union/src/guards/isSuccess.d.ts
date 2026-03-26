import type { RefinedSuccess } from '../types/result/RefinedSuccess.js';
import type { VariantConfig } from '../types/variant/VariantConfig.js';
export declare const isSuccess: <TMap extends Record<"success", VariantConfig>>(variantMap: TMap) => (value: unknown) => value is RefinedSuccess<TMap>;
//# sourceMappingURL=isSuccess.d.ts.map