import type { PayloadKeys } from '../utils/PayloadKeys.js';
import type { VariantConfig } from '../variant/VariantConfig.js';
export type RefinedVariant<TMap extends Record<string, VariantConfig>, K extends keyof TMap & string> = {
    type: K;
} & (PayloadKeys<TMap[K]> extends never ? {} : Record<PayloadKeys<TMap[K]>, unknown>);
//# sourceMappingURL=RefinedVariant.d.ts.map