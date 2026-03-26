import type { ExcludeField } from '../utils/ExcludeField.js';
import type { ExtractPayloadKeys } from '../utils/ExtractPayloadKeys.js';
import type { VariantConfig } from '../variant/VariantConfig.js';
export type CreateResultShape<TVariant extends string, TConfig extends VariantConfig, TPayloadKeys extends readonly string[] = ExtractPayloadKeys<TConfig>> = Readonly<{
    type: TVariant;
}> & (TConfig['payload'] extends 'never' ? {} : Record<TPayloadKeys[number], unknown>) & ExcludeField<TConfig['forbidden']>;
//# sourceMappingURL=CreateResultShape.d.ts.map