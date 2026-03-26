// @resultsafe/core-fp-union/src/utils/isVariantConfig.ts

import type { VariantConfig } from '../../types/variant/VariantConfig.js';

export const isVariantConfig = (value: unknown): value is VariantConfig => {
  if (typeof value !== 'object' || value === null) return false;

  const config = value as Record<string, unknown>;

  if (!('payload' in config)) return false;
  const payload = config['payload'];

  if (
    payload !== 'never' &&
    typeof payload !== 'string' &&
    !Array.isArray(payload)
  ) {
    return false;
  }

  if (
    'forbidden' in config &&
    typeof config['forbidden'] !== 'string' &&
    config['forbidden'] !== undefined
  ) {
    return false;
  }

  if (
    'strictFields' in config &&
    typeof config['strictFields'] !== 'boolean' &&
    config['strictFields'] !== undefined
  ) {
    return false;
  }

  return true;
};


