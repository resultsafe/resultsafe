import { hasOwn, isObject } from '../internal/object.js';
import type {
  AsyncValidatorFn,
  PayloadKeys,
  VariantConfig,
} from '../shared-types.js';
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
 * @since 0.1.0
 * @see {@link refineAsyncResult} - Curry-конструктор асинхронного refiner.
 * @example
 * ```ts
 * import { refineAsyncResultU } from '@resultsafe/core-fp-result';
 *
 * const map = { ok: { payload: 'value' } } as const;
 * const out = await refineAsyncResultU({ type: 'ok', value: 1 }, 'ok', map, {
 *   value: async (x: unknown) => typeof x === 'number',
 * });
 *
 * console.log(out?.type); // ok
 * ```
 * @public
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
): Promise<UniversalAsyncRefinedResult<K, TMap, TValidators> | null> => {
  // Императивный стиль с early returns (как в Rust)
  return (async () => {
    // Rust-style early returns с Option-like поведением
    if (!isObject(value)) return null;
    if (!hasOwn(value, 'type')) return null;

    const t = value['type'];
    if (t !== variant) return null;

    const config = variantMap[variant];
    if (!config) return null;

    // Payload validation с асинхронными валидаторами
    const keys = getPayloadKeys(config);
    for (const key of keys) {
      const check = validators[key as keyof TValidators];
      if (!check) continue;

      const field = value[key as string];
      // Type-safe async validation
      const isValid = await (check as AsyncValidatorFn)(field);
      if (!isValid) return null;
    }

    // Safe cast после всех проверок
    return value as UniversalAsyncRefinedResult<K, TMap, TValidators>;
  })();
};
