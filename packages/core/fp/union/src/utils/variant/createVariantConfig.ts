// @resultsafe/core-fp-union/src/utils/createVariantConfig.ts

import {
  DEFAULT_VARIANT_CONFIG,
  type VariantConfig,
} from '../../types/variant/VariantConfig.js';

export const createVariantConfig = <T extends Partial<VariantConfig>>(
  config: T,
): VariantConfig & T => {
  return {
    ...DEFAULT_VARIANT_CONFIG,
    ...config,
  } as VariantConfig & T;
};


