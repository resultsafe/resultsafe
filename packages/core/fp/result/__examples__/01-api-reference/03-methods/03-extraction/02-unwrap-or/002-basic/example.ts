/**
 * @module 002-basic
 * @title unwrapOr - Extract with Default
 * @description Learn to use unwrapOr to extract the Ok value or return a default. Safe extraction that never panics.
 * @example
 * import { Ok, Err, unwrapOr } from '@resultsafe/core-fp-result';
 * unwrapOr(Ok(7), 0); // 7
 * unwrapOr(Err('boom'), 0); // 0
 * @example
 * import { Ok, Err, unwrapOr } from '@resultsafe/core-fp-result';
 * const port = unwrapOr(getPort(), 8080);
 * console.log(port); // extracted value or default
 * @tags unwrapOr,extraction,default,safe,beginner
 * @since 0.1.0
 * @lastModified 2026-03-27T14:30:00Z
 * @difficulty Beginner
 * @time 5min
 * @category methods
 * @see {@link unwrap} @see {@link unwrapOrElse} @see {@link orElse}
 * @ai {"purpose":"Teach unwrapOr for safe extraction with default","prerequisites":["Result type"],"objectives":["unwrapOr syntax","Default values"],"rag":{"queries":["how to use unwrapOr","unwrapOr default example"],"intents":["learning","practical"],"expectedAnswer":"Use unwrapOr(result, default) to extract Ok or return default","confidence":0.95},"embedding":{"semanticKeywords":["unwrapOr","extraction","default","safe","result"],"conceptualTags":["safe-extraction","fallback"],"useCases":["configuration","optional-values"]},"codeSearch":{"patterns":["unwrapOr(result, default)","unwrapOr(source, fallback)"],"imports":["import { unwrapOr } from '@resultsafe/core-fp-result'"]},"learningPath":{"progression":["001-unwrap","003-expect"]},"chunking":{"type":"self-contained","section":"methods","subsection":"extraction","tokenCount":250,"relatedChunks":["001-unwrap","003-expect"]}}
 */

import { Err, Ok, unwrapOr } from '@resultsafe/core-fp-result';

console.log(unwrapOr(Ok(7), 0));
console.log(unwrapOr(Err('boom'), 0));
