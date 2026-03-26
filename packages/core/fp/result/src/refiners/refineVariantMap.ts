import type {
  PayloadKeys,
  ValidatorFn,
  VariantConfig,
} from '../shared-types.js';
import type { SyncRefinedResultUnion } from './types/SyncRefinedResultUnion.js';
import type { SyncValidatorMap } from './types/SyncValidatorMap.js';

/**
 * Уточняет значение дискриминированного объединения по полной карте вариантов.
 *
 * @typeParam TMap - Тип карты конфигурации вариантов.
 * @typeParam TValidators - Тип карты валидаторов по вариантам.
 * @param value - Значение для валидации и уточнения.
 * @param variantMap - Полная карта конфигурации вариантов.
 * @param validators - Валидаторы, сгруппированные по ключу варианта.
 * @returns Уточненный элемент объединения или `null`.
 * @since 0.1.0
 * @see {@link refineResult} - Refines one concrete variant key.
 * @example
 * ```ts
 * import { refineVariantMap } from '@resultsafe/core-fp-result';
 *
 * const map = {
 *   created: { payload: 'id' },
 *   failed: { payload: 'reason' },
 * } as const;
 *
 * const out = refineVariantMap({ type: 'created', id: '1' }, map, {
 *   created: { id: (x: unknown): x is string => typeof x === 'string' },
 *   failed: { reason: (x: unknown): x is string => typeof x === 'string' },
 * });
 *
 * console.log(out?.type); // created
 * ```
 * @public
 */
export function refineVariantMap<
  TMap extends Record<string, VariantConfig>,
  TValidators extends SyncValidatorMap<TMap>,
>(
  value: unknown,
  variantMap: TMap,
  validators: TValidators,
): SyncRefinedResultUnion<TMap, TValidators> | null {
  if (typeof value !== 'object' || value === null || !('type' in value)) {
    return null;
  }

  const rawType = (value as { type?: unknown }).type;
  if (typeof rawType !== 'string' || !(rawType in variantMap)) return null;

  // фиксируем конкретный ключ варианта
  type K = Extract<keyof TMap, string>;
  const k = rawType as K;

  const config = variantMap[k];
  if (!config) return null;

  // ключи payload для конкретного K
  const payload = config.payload;
  const keys = (
    payload === 'never' ? [] : Array.isArray(payload) ? payload : [payload]
  ) as readonly PayloadKeys<TMap[typeof k]>[];

  // валидаторы, согласованные с конкретным K
  const vvs = validators[k] as
    | Partial<Record<PayloadKeys<TMap[typeof k]>, ValidatorFn>>
    | undefined;

  if (vvs) {
    const obj = value as Record<string, unknown>;
    for (const key of keys) {
      const check = vvs[key];
      if (!check) continue;
      if (!check(obj[key as string])) return null;
    }
  }

  return value as SyncRefinedResultUnion<TMap, TValidators>;
}
