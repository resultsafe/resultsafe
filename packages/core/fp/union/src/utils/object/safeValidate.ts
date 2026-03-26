// @resultsafe/core-fp-union/src/utils/object/safeValidate.ts

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


