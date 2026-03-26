import type { CreateAnyResult } from '../types/result/CreateAnyResult.js';
import type { VariantConfig } from '../types/variant/VariantConfig.js';
export declare const isResult: <TMap extends Record<string, VariantConfig>>(variantMap: TMap) => (value: unknown) => value is CreateAnyResult<TMap>;
//# sourceMappingURL=isResult.d.ts.map