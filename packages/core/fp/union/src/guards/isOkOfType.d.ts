import type { RefinedOk } from '../types/result/RefinedOk.js';
import type { VariantConfig } from '../types/variant/VariantConfig.js';
export declare const isOkOfType: <TMap extends Record<"ok", VariantConfig>>(variantMap: TMap) => (value: unknown, validators: Partial<Record<TMap["ok"]["payload"] extends string ? TMap["ok"]["payload"] : TMap["ok"]["payload"] extends readonly string[] ? TMap["ok"]["payload"][number] : never, (x: unknown) => x is unknown>>) => value is RefinedOk<TMap>;
//# sourceMappingURL=isOkOfType.d.ts.map