import type { RefinedOk } from '../types/result/RefinedOk.js';
import type { VariantConfig } from '../types/variant/VariantConfig.js';
export declare const isOkAnd: <TMap extends Record<"ok", VariantConfig>>(variantMap: TMap) => <TExtra extends object = {}>(and: (v: RefinedOk<TMap>) => v is RefinedOk<TMap> & TExtra) => (value: unknown) => value is RefinedOk<TMap> & TExtra;
//# sourceMappingURL=isOkAnd.d.ts.map