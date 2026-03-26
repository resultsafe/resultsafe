import type { VariantConfig } from '../types/variant/VariantConfig.js';
import type { VariantShape } from '../types/variant/VariantShape.js';
export declare const isVariant: <TMap extends Record<string, VariantConfig>>(variantMap: TMap) => <K extends keyof TMap & string>(variant: K) => (value: unknown) => value is VariantShape<TMap, K>;
//# sourceMappingURL=isVariant.d.ts.map