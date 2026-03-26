import type { CreateAnyResult } from '../types/result/CreateAnyResult.js';
import type { VariantConfig } from '../types/variant/VariantConfig.js';
export declare const isValidatedResult: <TMap extends Record<string, VariantConfig>>(variantMap: TMap) => (value: unknown, validators?: Partial<{ [K in keyof TMap]: Partial<Record<TMap[K]["payload"] extends string ? TMap[K]["payload"] : TMap[K]["payload"] extends readonly string[] ? TMap[K]["payload"][number] : never, (x: unknown) => x is unknown>>; }>) => value is CreateAnyResult<TMap>;
//# sourceMappingURL=isValidatedResult.d.ts.map