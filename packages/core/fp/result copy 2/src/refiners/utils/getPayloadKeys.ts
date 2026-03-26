import type {
  PayloadKeys,
  VariantConfig,
} from '../../shared-types.js';

/**
 * Нормализует конфигурацию payload варианта в список ключей.
 *
 * @typeParam C - Тип конфигурации варианта.
 * @param config - Конфигурация варианта с определением payload.
 * @returns Ключи payload как readonly-массив.
 * @since 0.1.0
 * @example
 * ```ts
 * import { getPayloadKeys } from '@resultsafe/core-fp-result/src/refiners/utils/getPayloadKeys.js';
 *
 * const keys = getPayloadKeys({ payload: ['id', 'meta'] } as const);
 * console.log(keys.length); // 2
 * ```
 * @internal
 */
export const getPayloadKeys = <C extends VariantConfig>(
  config: C,
): readonly PayloadKeys<C>[] => {
  const p = config.payload;
  if (p === 'never') return [];
  return (Array.isArray(p) ? p : [p]) as readonly PayloadKeys<C>[];
};


