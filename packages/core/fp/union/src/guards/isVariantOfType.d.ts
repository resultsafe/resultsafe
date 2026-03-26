import type { PayloadValidator } from '../types/validation/PayloadValidator.js';
import type { VariantConfig } from '../types/variant/VariantConfig.js';
import type { VariantShape } from '../types/variant/VariantShape.js';
export declare const isVariantOfType: <TMap extends Record<string, VariantConfig>>(variantMap: TMap) => <K extends keyof TMap & string>(variant: K, validators?: PayloadValidator<TMap[K]>) => (value: unknown) => value is VariantShape<TMap, K>;
//# sourceMappingURL=isVariantOfType.d.ts.map