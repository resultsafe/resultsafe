// @resultsafe/core-fp-union/src/validators/createError.ts
import type { ValidationError } from '../types/validation/ValidationError.js';
import type { ValidationResult } from '../types/validation/ValidationResult.js';

export const createError = <T>(
  code: ValidationError['code'],
  message: string,
  details?: Partial<Pick<ValidationError, 'field' | 'variant'>>,
): ValidationResult<T> =>
  ({
    success: false,
    error: {
      code,
      message,
      ...details,
    },
  }) as const;


