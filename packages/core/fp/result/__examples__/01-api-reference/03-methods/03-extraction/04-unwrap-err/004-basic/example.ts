/**
 * @module 004-basic
 * @title unwrapErr - Extract Error Value
 * @description Learn to use unwrapErr to extract the error value from a Result. Panics if the Result is Ok - use only when expecting errors.
 * @example
 * import { Err, unwrapErr } from '@resultsafe/core-fp-result';
 * const error = unwrapErr(Err({ code: 'E_DB' }));
 * console.log(error.code); // 'E_DB'
 * @example
 * import { Ok, Err, unwrapErr } from '@resultsafe/core-fp-result';
 * unwrapErr(Err('error')); // 'error'
 * unwrapErr(Ok(42)); // throws Error
 * @tags unwrapErr,extraction,error,panic,intermediate
 * @since 0.1.0
 * @lastModified 2026-03-27T14:30:00Z
 * @difficulty Intermediate
 * @time 5min
 * @category methods
 * @see {@link unwrap} @see {@link expectErr} @see {@link mapErr}
 * @ai {"purpose":"Teach unwrapErr for extracting error values","prerequisites":["Result type"],"objectives":["unwrapErr syntax","Error extraction"],"rag":{"queries":["how to unwrapErr Result","unwrapErr error example"],"intents":["learning","practical"],"expectedAnswer":"Use unwrapErr(result) to extract Err value, throws on Ok","confidence":0.95},"embedding":{"semanticKeywords":["unwrapErr","extraction","error","panic","result"],"conceptualTags":["unsafe-extraction","error-handling"],"useCases":["error-testing","assertions"]},"codeSearch":{"patterns":["unwrapErr(Err(error))","unwrapErr(result)"],"imports":["import { unwrapErr } from '@resultsafe/core-fp-result'"]},"learningPath":{"progression":["003-expect","005-expect-err"]},"chunking":{"type":"self-contained","section":"methods","subsection":"extraction","tokenCount":250,"relatedChunks":["003-expect","005-expect-err"]}}
 */

import { Err, unwrapErr } from '@resultsafe/core-fp-result';

const error = unwrapErr(Err({ code: 'E_DB' }));
console.log(error.code);
