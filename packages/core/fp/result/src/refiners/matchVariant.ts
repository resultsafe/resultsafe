import type { Handler, Matcher, VariantOf } from './types/index.js';

/**
 * Creates a chained matcher for a discriminated union value.
 *
 * @typeParam T - The discriminated union type.
 * @param value - The union value to match.
 * @returns A fluent matcher with `with` and `otherwise` branches.
 * @since 0.1.0
 * @see {@link matchVariantStrict} - Requires exhaustive matching at runtime.
 * @example
 * ```ts
 * import { matchVariant } from '@resultsafe/core-fp-result';
 *
 * const out = matchVariant<{ type: 'ok'; value: number } | { type: 'err'; error: string }>({
 *   type: 'ok',
 *   value: 1,
 * })
 *   .with('ok', (v) => `ok:${v.value}`)
 *   .otherwise(() => 'fallback')
 *   .run();
 *
 * console.log(out); // ok:1
 * ```
 * @public
 */
export const matchVariant = <T extends VariantOf>(
  value: T,
): Matcher<T, unknown> => {
  const handlers: readonly Handler<T['type'], T, unknown>[] = [];

  const withHandler = <K extends T['type']>(
    variant: K,
    fn: (value: Extract<T, { type: K }>) => unknown,
  ): Matcher<T, unknown> => {
    const newHandlers = [...handlers, { variant, fn }] as const;

    return {
      with: <K2 extends T['type']>(
        variant2: K2,
        fn2: (value: Extract<T, { type: K2 }>) => unknown,
      ): Matcher<T, unknown> => {
        const newerHandlers = [
          ...newHandlers,
          { variant: variant2, fn: fn2 },
        ] as const;

        return {
          with: withHandler,
          otherwise: (fallback: (value: T) => unknown) => ({
            run: (): unknown => {
              for (const h of newerHandlers) {
                if (value.type === h.variant) {
                  const fn = h.fn as (input: T) => unknown;
                  return fn(value);
                }
              }
              return fallback(value);
            },
          }),
        } as Matcher<T, unknown>;
      },
      otherwise: (fallback: (value: T) => unknown) => ({
        run: (): unknown => {
          for (const h of newHandlers) {
            if (value.type === h.variant) {
              const fn = h.fn as (input: T) => unknown;
              return fn(value);
            }
          }
          return fallback(value);
        },
      }),
    } as Matcher<T, unknown>;
  };

  const matcher: Matcher<T, unknown> = {
    with: withHandler,
    otherwise: (fallback: (value: T) => unknown) => ({
      run: (): unknown => {
        /* v8 ignore start -- unreachable with current immutable root handler list */
        for (const h of handlers) {
          if (value.type === h.variant) {
            const fn = h.fn as (input: T) => unknown;
            return fn(value);
          }
        }
        /* v8 ignore stop */
        return fallback(value);
      },
    }),
  };

  return matcher;
};
