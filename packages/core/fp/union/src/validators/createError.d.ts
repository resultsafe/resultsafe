import type { ValidationError } from '../types/validation/ValidationError.js';
import type { ValidationResult } from '../types/validation/ValidationResult.js';
export declare const createError: <T>(code: ValidationError["code"], message: string, details?: Partial<Pick<ValidationError, "field" | "variant">>) => ValidationResult<T>;
//# sourceMappingURL=createError.d.ts.map