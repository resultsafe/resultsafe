import type { RefinedFailure } from '../types/result/RefinedFailure.js';
import type { VariantConfig } from '../types/variant/VariantConfig.js';
export declare const isFailure: <TMap extends Record<"failure", VariantConfig>>(variantMap: TMap) => (value: unknown, validators?: Partial<Record<TMap["failure"]["payload"] extends string ? TMap["failure"]["payload"] : TMap["failure"]["payload"] extends readonly string[] ? TMap["failure"]["payload"][number] : never, (x: unknown) => x is unknown>>) => value is RefinedFailure<TMap>;
//# sourceMappingURL=isFailure.d.ts.map