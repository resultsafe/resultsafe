import type { VariantConfig } from '../variant/VariantConfig.js';
export type CreateAnyResult<TMap extends Record<string, VariantConfig>> = {
    [K in keyof TMap]: {
        type: K;
    } & (TMap[K]['payload'] extends 'never' ? {} : TMap[K]['payload'] extends string ? {
        [P in TMap[K]['payload']]: unknown;
    } : {
        [P in TMap[K]['payload'][number]]: unknown;
    }) & (TMap[K]['forbidden'] extends string ? Partial<Record<TMap[K]['forbidden'], never>> : {});
}[keyof TMap] | undefined;
//# sourceMappingURL=CreateAnyResult.d.ts.map