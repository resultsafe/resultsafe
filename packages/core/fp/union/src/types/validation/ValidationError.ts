// @resultsafe/core-fp-union/src/types/ValidationError.ts

export interface ValidationError {
  readonly code:
    | 'NOT_OBJECT'
    | 'MISSING_TYPE'
    | 'INVALID_TYPE'
    | 'UNKNOWN_VARIANT'
    | 'MISSING_FIELD'
    | 'FORBIDDEN_FIELD'
    | 'UNEXPECTED_FIELD'
    | 'VALIDATION_FAILED';
  readonly message: string;
  readonly field?: string;
  readonly variant?: string;
}


