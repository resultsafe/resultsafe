import type {
  AsyncValidatorFn,
  PayloadKeys,
  VariantConfig,
} from '../shared-types.js';

import { hasOwn, isObject } from '../internal/object.js';
import type { UniversalAsyncRefinedResult } from './types/index.js';

/** Resolves payload keys from variant configuration. @internal */
const getPayloadKeys = <C extends VariantConfig>(
  config: C,
): readonly PayloadKeys<C>[] => {
  const p = config.payload;
  if (p === 'never') return [];
  return (Array.isArray(p) ? p : [p]) as readonly PayloadKeys<C>[];
};

/**
 * Создает асинхронный refiner варианта с асинхронными валидаторами payload.
 *
 * @typeParam TMap - Тип карты конфигурации вариантов.
 * @param variantMap - Карта, описывающая допустимые варианты и поля payload.
 * @returns A curried async refiner factory bound to `variantMap`.
 * @since 0.1.0
 * @see {@link refineAsyncResultU} - Непосредственный (не-curry) вариант helper.
 * @example
 * ```ts
 * import { refineAsyncResult } from '@resultsafe/core-fp-result';
 *
 * const map = { ok: { payload: 'value' } } as const;
 * const refineOk = refineAsyncResult(map)('ok')({
 *   value: async (x: unknown) => typeof x === 'number',
 * });
 *
 * console.log(await refineOk({ type: 'ok', value: 1 })); // { type: 'ok', value: 1 }
 * ```
 * @public
 */
export const refineAsyncResult =
  <TMap extends Record<string, VariantConfig>>(variantMap: TMap) =>
  <K extends keyof TMap & string>(variant: K) =>
  <TValidators extends Partial<Record<PayloadKeys<TMap[K]>, AsyncValidatorFn>>>(
    validators: TValidators,
  ) =>
  async (
    value: unknown,
  ): Promise<UniversalAsyncRefinedResult<K, TMap, TValidators> | null> => {
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
      const isValid = await check(field); // ✅ Асинхронная валидация
      if (!isValid) return null;
    }

    return value as UniversalAsyncRefinedResult<K, TMap, TValidators>;
  };

/**
 * Уточняет значение асинхронно в не-curry стиле вызова.
 *
 * @typeParam TMap - Тип карты конфигурации вариантов.
 * @typeParam K - Ключ целевого варианта.
 * @typeParam TValidators - Карта асинхронных валидаторов для полей payload.
 * @param value - Значение для валидации и уточнения.
 * @param variant - Ключ целевого варианта.
 * @param variantMap - Карта конфигурации вариантов.
 * @param validators - Асинхронные валидаторы payload.
 * @returns Промис с уточненным значением или `null`.
 * @remarks
 * This export is kept for compatibility. Prefer {@link refineAsyncResultU}
 * from `refineAsyncResultU.ts` как каноническую точку входа без curry.
 * @since 0.1.0
 * @example
 * ```ts
 * import { refineAsyncResultU } from '@resultsafe/core-fp-result/src/refiners/refineAsyncResult.js';
 *
 * const map = { ok: { payload: 'value' } } as const;
 * const out = await refineAsyncResultU({ type: 'ok', value: 1 }, 'ok', map, {
 *   value: async (x: unknown) => typeof x === 'number',
 * });
 *
 * console.log(out?.type); // ok
 * ```
 * @internal
 */
export const refineAsyncResultU = <
  TMap extends Record<string, VariantConfig>,
  K extends keyof TMap & string,
  TValidators extends Partial<Record<PayloadKeys<TMap[K]>, AsyncValidatorFn>>,
>(
  value: unknown,
  variant: K,
  variantMap: TMap,
  validators: TValidators,
): Promise<UniversalAsyncRefinedResult<K, TMap, TValidators> | null> =>
  refineAsyncResult(variantMap)(variant)(validators)(value);


