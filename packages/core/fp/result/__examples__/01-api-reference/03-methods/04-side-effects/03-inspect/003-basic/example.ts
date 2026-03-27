/**
 * @module 003-basic
 * @title inspect - Observe Ok Value Without Modification
 * @description Learn to use inspect to observe Ok values with a callback for debugging. Like tap but designed for inspection without side effects.
 * @example
 * import { Ok, inspect } from '@resultsafe/core-fp-result';
 * const result = inspect(Ok({ id: 'u-1' }), (value) => {
 *   console.log('observed:', value.id);
 * });
 * @example
 * import { Ok, Err, inspect } from '@resultsafe/core-fp-result';
 * inspect(Ok(5), v => debug(v)); // observes, returns Ok(5)
 * inspect(Err('error'), v => debug(v)); // no-op
 * @tags inspect,observation,debugging,immutable,intermediate
 * @since 0.1.0
 * @lastModified 2026-03-27T14:30:00Z
 * @difficulty Intermediate
 * @time 5min
 * @category methods
 * @see {@link tap} @see {@link inspectErr} @see {@link tapErr}
 * @ai {"purpose":"Teach inspect for observing Ok values","prerequisites":["Result type","Debugging"],"objectives":["inspect syntax","Observation pattern"],"rag":{"queries":["how to use inspect on Result","inspect debugging example"],"intents":["learning","practical"],"expectedAnswer":"Use inspect(result, fn) to observe Ok value without modification","confidence":0.95},"embedding":{"semanticKeywords":["inspect","observation","debugging","immutable","result"],"conceptualTags":["observation","immutability"],"useCases":["debugging","logging","tracing"]},"codeSearch":{"patterns":["inspect(result, (v) => ...)","inspect(source, fn)"],"imports":["import { inspect } from '@resultsafe/core-fp-result'"]},"learningPath":{"progression":["001-tap","004-inspect-err"]},"chunking":{"type":"self-contained","section":"methods","subsection":"side-effects","tokenCount":260,"relatedChunks":["001-tap","004-inspect-err"]}}
 */

import { Ok, inspect } from '@resultsafe/core-fp-result';

const result = inspect(Ok({ id: 'u-1' }), (value) => {
  console.log('observed id:', value.id);
});

console.log(result);
