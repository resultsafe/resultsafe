/**
 * @module 001-basic-usage
 * @title unwrap - Extract Ok Value
 * @description Learn to use unwrap to extract the Ok value from a Result. Panics if the Result is Err - use only when you're certain of success.
 * @example
 * import { Ok, unwrap } from '@resultsafe/core-fp-result';
 * const value = unwrap(Ok(99));
 * console.log(value); // 99
 * @example
 * import { Ok, Err, unwrap } from '@resultsafe/core-fp-result';
 * unwrap(Ok(42)); // 42
 * unwrap(Err('error')); // throws Error
 * @tags unwrap,extraction,value,panic,beginner
 * @since 0.1.0
 * @lastModified 2026-03-27T14:30:00Z
 * @difficulty Beginner
 * @time 5min
 * @category methods
 * @see {@link unwrapOr} @see {@link unwrapOrElse} @see {@link expect}
 * @ai {"purpose":"Teach unwrap for extracting Ok values","prerequisites":["Result type"],"objectives":["unwrap syntax","Value extraction"],"rag":{"queries":["how to unwrap Result","unwrap value example"],"intents":["learning","practical"],"expectedAnswer":"Use unwrap(result) to extract Ok value, throws on Err","confidence":0.95},"embedding":{"semanticKeywords":["unwrap","extraction","value","panic","result"],"conceptualTags":["unsafe-extraction","assertion"],"useCases":["confident-success","testing"]},"codeSearch":{"patterns":["unwrap(Ok(value))","unwrap(result)"],"imports":["import { unwrap } from '@resultsafe/core-fp-result'"]},"learningPath":{"progression":["002-unwrap-or","003-expect"]},"chunking":{"type":"self-contained","section":"methods","subsection":"extraction","tokenCount":240,"relatedChunks":["002-unwrap-or","003-expect"]}}
 */

import { Ok, unwrap } from '@resultsafe/core-fp-result';

const value = unwrap(Ok(99));
console.log(value);
