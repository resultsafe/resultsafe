import type { RefinedErr } from '../types/result/RefinedErr.js';
import type { VariantConfig } from '../types/variant/VariantConfig.js';
export declare const isErrAnd: <TMap extends Record<"err", VariantConfig>>(variantMap: TMap) => <TExtra extends object = {}>(and: (v: RefinedErr<TMap>) => v is RefinedErr<TMap> & TExtra) => (value: unknown) => value is RefinedErr<TMap> & TExtra;
//# sourceMappingURL=isErrAnd.d.ts.map