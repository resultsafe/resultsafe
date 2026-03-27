/**
 * @module 002-with-custom-error
 * @title Err with Custom Error Types
 * @description Creating error Result values with custom error types for better error handling and type safety.
 * @example
 * import { Err } from '@resultsafe/core-fp-result';
 * interface ApiError { code: number; message: string; }
 * const error: Err<never, ApiError> = Err({ code: 500, message: 'Server error' });
 * @tags result,err,custom-error,typescript,intermediate
 * @since 0.1.0
 * @difficulty Intermediate
 * @time 5min
 * @category constructors
 * @see {@link 001-basic-usage} @see {@link 003-real-world}
 * @ai {"purpose":"Teach custom error types with Err","prerequisites":["Err constructor","TypeScript interfaces"],"objectives":["Custom error types","Type safety"],"rag":{"queries":["Err custom error type","Err with object"],"intents":["learning","practical"],"expectedAnswer":"Use Err with object for structured errors","confidence":0.95},"embedding":{"semanticKeywords":["err","custom-error","object","typescript"],"conceptualTags":["type-safety","error-handling"],"useCases":["api-error","validation-error"]},"codeSearch":{"patterns":["Err<T,E>(error)","Err({code,message})"],"imports":["import { Err } from '@resultsafe/core-fp-result'"]},"learningPath":{"progression":["003-real-world"]},"chunking":{"type":"self-contained","section":"constructors","subsection":"err","tokenCount":200,"relatedChunks":["001-basic-usage","003-real-world"]}}
 */

import { Err, type Result } from '@resultsafe/core-fp-result';

interface ApiError {
  code: number;
  message: string;
}

const error: Result<never, ApiError> = Err({
  code: 500,
  message: 'Server error',
});

console.log(error); // { ok: false, error: { code: 500, message: 'Server error' } }
