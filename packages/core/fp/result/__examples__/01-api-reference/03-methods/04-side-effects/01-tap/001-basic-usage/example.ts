/**
 * @module 001-basic-usage
 * @title tap - Side Effect on Ok Value
 * @description Learn to use tap to perform side effects on Ok values without modifying the Result. Useful for logging, debugging, or intermediate operations.
 * @example
 * import { Ok, tap } from '@resultsafe/core-fp-result';
 * const result = tap(Ok(10), (value) => {
 *   console.log('processing:', value);
 * });
 * @example
 * import { Ok, Err, tap } from '@resultsafe/core-fp-result';
 * tap(Ok(5), v => log(v)); // logs, returns Ok(5)
 * tap(Err('error'), v => log(v)); // no-op, returns Err
 * @tags tap,side-effect,logging,debugging,intermediate
 * @since 0.1.0
 * @lastModified 2026-03-27T14:30:00Z
 * @difficulty Intermediate
 * @time 5min
 * @category methods
 * @see {@link tapErr} @see {@link inspect} @see {@link map}
 * @ai {"purpose":"Teach tap for side effects on Ok values","prerequisites":["Result type","Side effects"],"objectives":["tap syntax","Side effect pattern"],"rag":{"queries":["how to use tap on Result","tap side effect example"],"intents":["learning","practical"],"expectedAnswer":"Use tap(result, fn) to perform side effect on Ok without modification","confidence":0.95},"embedding":{"semanticKeywords":["tap","side-effect","logging","debugging","result"],"conceptualTags":["side-effects","immutability"],"useCases":["logging","debugging","telemetry"]},"codeSearch":{"patterns":["tap(result, (v) => ...)","tap(source, fn)"],"imports":["import { tap } from '@resultsafe/core-fp-result'"]},"learningPath":{"progression":["002-tap-err","003-inspect"]},"chunking":{"type":"self-contained","section":"methods","subsection":"side-effects","tokenCount":260,"relatedChunks":["002-tap-err","003-inspect"]}}
 */

import { Ok, tap } from '@resultsafe/core-fp-result';

const result = tap(Ok(10), (value) => {
  console.log('side effect with:', value);
});

console.log(result);
