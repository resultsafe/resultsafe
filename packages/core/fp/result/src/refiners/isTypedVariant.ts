/**
 * Создает runtime type guard для варианта дискриминированного объединения.
 *
 * @typeParam K - The discriminant literal type.
 * @param variant - Значение дискриминанта для сопоставления.
 * @returns A predicate that checks `{ type: K }` shape.
 * @since 0.1.0
 * @see {@link isTypedVariantOf} - Расширяет проверку ключами payload.
 * @example
 * ```ts
 * import { isTypedVariant } from '@resultsafe/core-fp-result';
 *
 * const isCreated = isTypedVariant('created');
 * console.log(isCreated({ type: 'created' })); // true
 * ```
 * @public
 */
export const isTypedVariant =
  <K extends string>(variant: K) =>
  (value: unknown): value is { type: K } => {
    if (typeof value !== 'object' || value === null) return false;
    if (!('type' in value)) return false;

    const obj = value as Record<string, unknown>;
    return obj['type'] === variant;
  };
