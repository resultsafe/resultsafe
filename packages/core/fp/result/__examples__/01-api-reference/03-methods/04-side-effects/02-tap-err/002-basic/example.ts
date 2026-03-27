/**
 * @module 002-basic
 * @title tapErr - Side Effect on Error Value
 * @description Learn to use tapErr to perform side effects on Err values without modifying the Result. Useful for error logging, debugging, or telemetry.
 * @example
 * import { Err, tapErr } from '@resultsafe/core-fp-result';
 * const result = tapErr(Err('fatal'), (error) => {
 *   console.log('error:', error);
 * });
 * @example
 * import { Ok, Err, tapErr } from '@resultsafe/core-fp-result';
 * tapErr(Err('error'), e => log(e)); // logs, returns Err
 * tapErr(Ok(5), e => log(e)); // no-op, returns Ok
 * @tags tapErr,side-effect,error,logging,intermediate
 * @since 0.1.0
 * @lastModified 2026-03-27T14:30:00Z
 * @difficulty Intermediate
 * @time 5min
 * @category methods
 * @see {@link tap} @see {@link inspectErr} @see {@link mapErr}
 * @ai {"purpose":"Teach tapErr for side effects on Err values","prerequisites":["Result type","Side effects"],"objectives":["tapErr syntax","Error logging pattern"],"rag":{"queries":["how to use tapErr on Result","tapErr error logging example"],"intents":["learning","practical"],"expectedAnswer":"Use tapErr(result, fn) to perform side effect on Err without modification","confidence":0.95},"embedding":{"semanticKeywords":["tapErr","side-effect","error","logging","result"],"conceptualTags":["side-effects","error-handling"],"useCases":["error-logging","debugging","telemetry"]},"codeSearch":{"patterns":["tapErr(result, (e) => ...)","tapErr(source, fn)"],"imports":["import { tapErr } from '@resultsafe/core-fp-result'"]},"learningPath":{"progression":["001-tap","003-inspect"]},"chunking":{"type":"self-contained","section":"methods","subsection":"side-effects","tokenCount":260,"relatedChunks":["001-tap","003-inspect"]}}
 */

import { Err, tapErr } from '@resultsafe/core-fp-result';

const result = tapErr(Err('fatal'), (error) => {
  console.log('side effect for error:', error);
});

console.log(result);
