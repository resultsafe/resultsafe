// @resultsafe/core-fp-union/src/validators/createSuccess.ts
import type { ValidationResult } from '../types/validation/ValidationResult.js';

export const createSuccess = <T>(data: T): ValidationResult<T> =>
  ({
    success: true,
    data,
  }) as const;


