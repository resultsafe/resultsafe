import type { Handler, MatchBuilder, VariantOf } from './types/index.js';

/**
 * Создает строгий matcher, выбрасывающий исключение для необработанных вариантов.
 *
 * @typeParam T - Тип дискриминированного объединения.
 * @param value - Значение объединения для сопоставления.
 * @returns Строгий builder сопоставления, требующий явных обработчиков.
 * @throws Error - Выбрасывает исключение, если ни один зарегистрированный обработчик не соответствует `value.type`.
 * @since 0.1.0
 * @see {@link matchVariant} - Использует fallback-ветку вместо выброса исключения.
 * @example
 * ```ts
 * import { matchVariantStrict } from '@resultsafe/core-fp-result';
 *
 * const out = matchVariantStrict<{ type: 'ok'; value: number } | { type: 'err'; error: string }>({
 *   type: 'err',
 *   error: 'boom',
 * })
 *   .with('ok', (v) => `ok:${v.value}`)
 *   .with('err', (v) => `err:${v.error}`)
 *   .run();
 *
 * console.log(out); // err:boom
 * ```
 * @public
 */
export const matchVariantStrict = <T extends VariantOf>(
  value: T,
): MatchBuilder<T, unknown> => {
  const handlers: readonly Handler<T['type'], T, unknown>[] = [];

  const builder = <Handled extends T['type'] = never>(): MatchBuilder<
    T,
    unknown,
    Handled
  > => ({
    with: <K extends Exclude<T['type'], Handled>>(
      variant: K,
      fn: (value: Extract<T, { type: K }>) => unknown,
    ) => {
      const newHandlers = [...handlers, { variant, fn }] as const;

      return {
        with: builder<Handled | K>().with,
        run: (() => {
          for (const h of newHandlers) {
            if (value.type === h.variant) {
              const fn = h.fn as (input: T) => unknown;
              return fn(value);
            }
          }
          throw new Error(
            `Unmatched variant: ${String((value as { type: unknown }).type)}`,
          );
        }) as Handled extends T['type'] ? () => unknown : never,
      } as MatchBuilder<T, unknown, Handled | K>;
    },

    run: (() => {
      /* v8 ignore start -- unreachable with current immutable root handler list */
      for (const h of handlers) {
        if (value.type === h.variant) {
          const fn = h.fn as (input: T) => unknown;
          return fn(value);
        }
      }
      /* v8 ignore stop */
      throw new Error(
        `Unmatched variant: ${String((value as { type: unknown }).type)}`,
      );
    }) as Handled extends T['type'] ? () => unknown : never,
  });

  return builder();
};
