// src/validators/safeValidate.ts
/**
 * [EN] Safely validate value with validator (catches exceptions)
 * [RU] Безопасно валидирует значение с помощью валидатора (ловит исключения)
 */
export const safeValidate = <T>(
  validator: (value: unknown) => value is T,
  value: unknown,
): value is T => {
  try {
    return validator(value);
  } catch {
    return false;
  }
};
