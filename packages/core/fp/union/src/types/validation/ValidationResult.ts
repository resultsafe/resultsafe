// @resultsafe/core-fp-union/src/types/ValidationResult.ts
import type { ValidationError } from './ValidationError.js';

export type ValidationResult<T> =
  | { readonly success: true; readonly data: T }
  | { readonly success: false; readonly error: ValidationError };


