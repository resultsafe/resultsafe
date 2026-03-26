import type { PayloadKeys } from '../types/utils/PayloadKeys.js';
import type { VariantConfig } from '../types/variant/VariantConfig.js';
export declare const isVariantOf: <TMap extends Record<string, VariantConfig>>(variantMap: TMap) => <K extends keyof TMap & string>(variant: K) => (value: unknown) => value is {
    type: K;
} & Record<PayloadKeys<TMap[K]>, unknown>;
//# sourceMappingURL=isVariantOf.d.ts.map