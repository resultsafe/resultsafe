// @resultsafe/core-fp-union/src/types/PayloadValidator.ts
import type { PayloadKeys } from '../utils/PayloadKeys.js';
import type { VariantConfig } from '../variant/VariantConfig.js';

export type PayloadValidator<T extends VariantConfig> = Partial<
  Record<PayloadKeys<T>, (x: unknown) => x is unknown>
>;


