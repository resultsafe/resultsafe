import type { VariantConfig } from '../variant/VariantConfig.js';
export type PayloadKeys<T extends VariantConfig> = T['payload'] extends 'never' ? never : T['payload'] extends string ? T['payload'] : T['payload'] extends readonly string[] ? T['payload'][number] : never;
//# sourceMappingURL=PayloadKeys.d.ts.map