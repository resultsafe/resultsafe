import type {
  PayloadKeys,
  ValidatorFn,
  VariantConfig,
} from '../shared-types.js';

import { hasOwn, isObject } from '../internal/object.js';
import type { UniversalRefinedResult } from './types/index.js';
import { getPayloadKeys } from './utils/index.js';

/**
 * Создает синхронный refiner варианта с валидаторами payload.
 *
 * @typeParam TMap - Тип карты конфигурации вариантов.
 * @param variantMap - Карта, описывающая допустимые варианты и поля payload.
 * @returns A curried refiner factory bound to `variantMap`.
 * @since 0.1.0
 * @see {@link refineResultU} - Непосредственный (не-curry) вариант helper.
 * @example
 * ```ts
 * import { refineResult } from '@resultsafe/core-fp-result';
 *
 * const map = { ok: { payload: 'value' } } as const;
 * const refineOk = refineResult(map)('ok')({
 *   value: (x: unknown): x is number => typeof x === 'number',
 * });
 *
 * console.log(refineOk({ type: 'ok', value: 1 })); // { type: 'ok', value: 1 }
 * ```
 * @public
 */
export const refineResult =
  <TMap extends Record<string, VariantConfig>>(variantMap: TMap) =>
  <K extends keyof TMap & string>(variant: K) =>
  <TValidators extends Partial<Record<PayloadKeys<TMap[K]>, ValidatorFn>>>(
    validators: TValidators,
  ) =>
  (value: unknown): UniversalRefinedResult<K, TMap, TValidators> | null => {
    if (!isObject(value)) return null;
    if (!hasOwn(value, 'type')) return null;

    const t = value['type'];
    if (t !== variant) return null;

    const config = variantMap[variant];
    if (!config) return null;

    const keys = getPayloadKeys(config);
    for (const key of keys) {
      const check = validators?.[key];
      if (!check) continue;

      const field = value[key as keyof typeof value];
      if (!check(field)) return null;
    }

    return value as UniversalRefinedResult<K, TMap, TValidators>;
  };

/**
 * Уточняет значение по карте вариантов в не-curry стиле вызова.
 *
 * @typeParam TMap - Тип карты конфигурации вариантов.
 * @typeParam K - Ключ целевого варианта.
 * @typeParam TValidators - Карта валидаторов для полей payload.
 * @param value - Значение для валидации и уточнения.
 * @param variant - Ключ целевого варианта.
 * @param variantMap - Карта конфигурации вариантов.
 * @param validators - Валидаторы payload для целевого варианта.
 * @returns Уточненное значение или `null`.
 * @remarks
 * Этот экспорт сохранен для совместимости. Предпочитайте {@link refineResultU} из
 * `refineResultU.ts` как каноническую точку входа без curry.
 * @since 0.1.0
 * @example
 * ```ts
 * import { refineResultU } from '@resultsafe/core-fp-result/src/refiners/refineResult.js';
 *
 * const map = { ok: { payload: 'value' } } as const;
 * const out = refineResultU({ type: 'ok', value: 1 }, 'ok', map, {
 *   value: (x: unknown): x is number => typeof x === 'number',
 * });
 *
 * console.log(out?.type); // ok
 * ```
 * @internal
 */
export const refineResultU = <
  TMap extends Record<string, VariantConfig>,
  K extends keyof TMap & string,
  TValidators extends Partial<Record<PayloadKeys<TMap[K]>, ValidatorFn>>,
>(
  value: unknown,
  variant: K,
  variantMap: TMap,
  validators: TValidators,
): UniversalRefinedResult<K, TMap, TValidators> | null =>
  refineResult(variantMap)(variant)(validators)(value);


