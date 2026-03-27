/**
 * @module 004-basic
 * @title inspectErr - Observe Error Value Without Modification
 * @description Learn to use inspectErr to observe Err values with a callback for debugging. Like tapErr but designed for inspection without side effects.
 * @example
 * import { Err, inspectErr } from '@resultsafe/core-fp-result';
 * const result = inspectErr(Err({ code: 'E_AUTH' }), (error) => {
 *   console.log('observed error:', error.code);
 * });
 * @example
 * import { Ok, Err, inspectErr } from '@resultsafe/core-fp-result';
 * inspectErr(Err('error'), e => debug(e)); // observes, returns Err
 * inspectErr(Ok(5), e => debug(e)); // no-op
 * @tags inspectErr,observation,error,debugging,intermediate
 * @since 0.1.0
 * @lastModified 2026-03-27T14:30:00Z
 * @difficulty Intermediate
 * @time 5min
 * @category methods
 * @see {@link inspect} @see {@link tapErr} @see {@link mapErr}
 * @ai {"purpose":"Teach inspectErr for observing Err values","prerequisites":["Result type","Debugging"],"objectives":["inspectErr syntax","Error observation pattern"],"rag":{"queries":["how to use inspectErr on Result","inspectErr debugging example"],"intents":["learning","practical"],"expectedAnswer":"Use inspectErr(result, fn) to observe Err value without modification","confidence":0.95},"embedding":{"semanticKeywords":["inspectErr","observation","error","debugging","result"],"conceptualTags":["observation","error-handling"],"useCases":["error-debugging","logging","tracing"]},"codeSearch":{"patterns":["inspectErr(result, (e) => ...)","inspectErr(source, fn)"],"imports":["import { inspectErr } from '@resultsafe/core-fp-result'"]},"learningPath":{"progression":["003-inspect","001-tap"]},"chunking":{"type":"self-contained","section":"methods","subsection":"side-effects","tokenCount":260,"relatedChunks":["003-inspect","001-tap"]}}
 */

import { Err, inspectErr } from '@resultsafe/core-fp-result';

const result = inspectErr(Err({ code: 'E_AUTH' }), (error) => {
  console.log('observed error:', error.code);
});

console.log(result);
