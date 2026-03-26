/**
 * Создает runtime type guard для варианта с дополнительными ключами payload.
 *
 * @typeParam K - The discriminant literal type.
 * @typeParam T - The required payload record shape.
 * @param variant - Значение дискриминанта для сопоставления.
 * @returns A predicate that checks variant and payload key presence.
 * @since 0.1.0
 * @see {@link isTypedVariant} - Проверяет только дискриминант.
 * @example
 * ```ts
 * import { isTypedVariantOf } from '@resultsafe/core-fp-result';
 *
 * const isCreated = isTypedVariantOf<'created', { id: unknown }>('created');
 * console.log(isCreated({ type: 'created', id: 1 })); // true
 * ```
 * @public
 */
export const isTypedVariantOf =
  <K extends string, T extends Record<string, unknown>>(variant: K) =>
  (value: unknown): value is { type: K } & T => {
    // Rust-style early returns with Option-like behavior
    if (typeof value !== 'object' || value === null) return false;
    if (!('type' in value)) return false;

    const obj = value as Record<string, unknown>;
    if (obj['type'] !== variant) return false;

    // Type-safe key checking (like Rust's HashMap.contains_key)
    const requiredKeys = Object.keys({} as T) as Array<keyof T>;
    for (const key of requiredKeys) {
      if (!(key in obj)) return false;
    }

    return true;
  };
