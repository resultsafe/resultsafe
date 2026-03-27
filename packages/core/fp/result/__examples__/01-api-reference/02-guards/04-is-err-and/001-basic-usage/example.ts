/**
 * @module 001-basic-usage
 * @title isErrAnd Type Guard with Predicate
 * @description Learn to use isErrAnd to check if a Result is Err and satisfies a predicate. Combines type narrowing with custom error validation logic.
 * @example
 * import { Err, isErrAnd } from '@resultsafe/core-fp-result';
 * const result = Err({ code: 503 });
 * const isRetryable = isErrAnd(result, e => e.code >= 500);
 * @example
 * import { Err, isErrAnd } from '@resultsafe/core-fp-result';
 * const result = Err({ code: 503, message: 'Service unavailable' });
 * console.log(isErrAnd(result, e => e.code >= 500)); // true
 * @tags isErrAnd,guard,predicate,result,error-handling,intermediate
 * @since 0.1.0
 * @lastModified 2026-03-27T14:30:00Z
 * @difficulty Intermediate
 * @time 5min
 * @category guards
 * @see {@link isErr} @see {@link isOkAnd} @see {@link match}
 * @ai {"purpose":"Teach isErrAnd guard with predicate","prerequisites":["isErr guard","TypeScript predicates"],"objectives":["isErrAnd syntax","Predicate function"],"rag":{"queries":["how to use isErrAnd","isErrAnd predicate example"],"intents":["learning","practical"],"expectedAnswer":"Use isErrAnd(result, predicate) to check Err and validate error","confidence":0.95},"embedding":{"semanticKeywords":["isErrAnd","guard","predicate","result","error-handling"],"conceptualTags":["type-narrowing","conditional-validation"],"useCases":["retry-logic","error-classification"]},"codeSearch":{"patterns":["isErrAnd(result, (e) => ...)","isErrAnd(result, predicate)"],"imports":["import { isErrAnd } from '@resultsafe/core-fp-result'"]},"learningPath":{"progression":["002-is-err","003-is-ok-and"]},"chunking":{"type":"self-contained","section":"guards","subsection":"is-err-and","tokenCount":280,"relatedChunks":["002-is-err","003-is-ok-and"]}}
 */

import { Err, isErrAnd } from '@resultsafe/core-fp-result';

const result = Err({ code: 503, message: 'Service unavailable' });

const isRetryable = isErrAnd(result, (error) => error.code >= 500);

console.log('retryable:', isRetryable);
