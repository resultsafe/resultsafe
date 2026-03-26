import { isErr } from '../guards/isErr.js';
import { type Result } from '../shared-types.js';

/**
 * Возвращает значение ошибки или выбрасывает исключение с пользовательским сообщением.
 *
 * @typeParam T - Тип успешного значения.
 * @typeParam E - Тип значения ошибки.
 * @param result - Исходный `Result`.
 * @param msg - Сообщение об ошибке, используемое когда `result` имеет `Ok`.
 * @returns Распакованное значение ошибки.
 * @throws Error - Выбрасывает исключение, когда `result` имеет `Ok`.
 * @since 0.1.0
 * @see {@link expect} - Симметричный helper для ветки успеха.
 * @example
 * ```ts
 * import { Err, expectErr } from '@resultsafe/core-fp-result';
 *
 * const error = expectErr(Err('boom'), 'must be err');
 * console.log(error); // boom
 * ```
 * @public
 */
export const expectErr = <T, E>(result: Result<T, E>, msg: string): E => {
  if (isErr(result)) {
    return result.error;
  }
  throw new Error(msg);
};
