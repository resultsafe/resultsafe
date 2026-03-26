// @resultsafe/core-fp-union/src/refiners/isVariantOf.ts
import type { PayloadKeys } from '../types/utils/PayloadKeys.js';
import type { VariantConfig } from '../types/variant/VariantConfig.js';

const isRecord = (x: unknown): x is Record<string, unknown> =>
  typeof x === 'object' && x !== null;

const hasOwn = <K extends PropertyKey>(
  obj: Record<string, unknown>,
  key: K,
): obj is Record<K & string, unknown> =>
  Object.prototype.hasOwnProperty.call(obj, key);

const getPayloadKeys = <C extends VariantConfig>(
  config: C,
): readonly PayloadKeys<C>[] => {
  const p = config.payload;
  if (p === 'never') return [];
  return (Array.isArray(p) ? p : [p]) as readonly PayloadKeys<C>[];
};

export const isVariantOf =
  <TMap extends Record<string, VariantConfig>>(variantMap: TMap) =>
  <K extends keyof TMap & string>(variant: K) =>
  (
    value: unknown,
  ): value is { type: K } & Record<PayloadKeys<TMap[K]>, unknown> => {
    if (!isRecord(value)) return false;
    if (!hasOwn(value, 'type')) return false;
    if (value['type'] !== variant) return false;

    const config = variantMap[variant];
    if (!config) return false;

    const keys = getPayloadKeys(config);
    for (const key of keys) {
      if (!hasOwn(value, key)) return false;
    }

    return true;
  };


