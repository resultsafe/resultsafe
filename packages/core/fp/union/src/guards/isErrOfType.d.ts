import type { RefinedErr } from '../types/result/RefinedErr.js';
import type { VariantConfig } from '../types/variant/VariantConfig.js';
export declare const isErrOfType: <TMap extends Record<"err", VariantConfig>>(variantMap: TMap) => (value: unknown, validators: Partial<Record<TMap["err"]["payload"] extends string ? TMap["err"]["payload"] : TMap["err"]["payload"] extends readonly string[] ? TMap["err"]["payload"][number] : never, (x: unknown) => x is unknown>>) => value is RefinedErr<TMap>;
//# sourceMappingURL=isErrOfType.d.ts.map