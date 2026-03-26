import type {
  PayloadKeys,
  ValidatorFn,
  VariantConfig,
} from '../shared-types.js';

import { refineResult } from './refineResult.js';
import type { SyncRefinedResult } from './types/index.js';

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
 * @since 0.1.0
 * @see {@link refineResult} - Curry-конструктор refiner.
 * @example
 * ```ts
 * import { refineResultU } from '@resultsafe/core-fp-result';
 *
 * const map = { ok: { payload: 'value' } } as const;
 * const out = refineResultU({ type: 'ok', value: 1 }, 'ok', map, {
 *   value: (x: unknown): x is number => typeof x === 'number',
 * });
 *
 * console.log(out?.type); // ok
 * ```
 * @public
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
): SyncRefinedResult<K, TMap, TValidators> | null =>
  refineResult(variantMap)(variant)(validators)(value);


