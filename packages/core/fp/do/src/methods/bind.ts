// @resultsafe/core-fp-do/src/methods/bind.ts

import type { Do } from '@resultsafe/core-fp-do';
import type { Result } from '@resultsafe/core-fp-result-shared';

const addProperty = <T extends object, K extends string, U>(
  obj: T,
  key: K,
  value: U,
): T & { [P in K]: U } =>
  ({
    ...obj,
    [key]: value,
  }) as T & { [P in K]: U };

export const bind = <T extends object, K extends string, U>(
  _do: Do<T>,
  name: K,
  fn: (value: T) => Result<U, string>,
): Result<T & { [P in K]: U }, string> => {
  const result = fn(_do.value);
  if (result.ok) {
    return {
      ok: true,
      value: addProperty(_do.value, name, result.value),
    };
  }
  return {
    ok: false,
    error: result.error,
  };
};


