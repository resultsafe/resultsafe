/**
 * @module 006-basic
 * @title unwrapOrElse - Extract with Lazy Default
 * @description Learn to use unwrapOrElse to extract the Ok value or compute a default lazily. Safe extraction with deferred computation for expensive defaults.
 * @example
 * import { Ok, Err, unwrapOrElse } from '@resultsafe/core-fp-result';
 * unwrapOrElse(Ok(7), () => 0); // 7
 * unwrapOrElse(Err('boom'), () => 0); // 0
 * @example
 * import { Ok, Err, unwrapOrElse } from '@resultsafe/core-fp-result';
 * unwrapOrElse(Ok(42), () => computeDefault()); // 42
 * unwrapOrElse(Err('fail'), () => computeDefault()); // computed
 * @tags unwrapOrElse,extraction,lazy,default,intermediate
 * @since 0.1.0
 * @lastModified 2026-03-27T14:30:00Z
 * @difficulty Intermediate
 * @time 5min
 * @category methods
 * @see {@link unwrapOr} @see {@link orElse} @see {@link mapErr}
 * @ai {"purpose":"Teach unwrapOrElse for lazy default computation","prerequisites":["Result type","Functions"],"objectives":["unwrapOrElse syntax","Lazy evaluation"],"rag":{"queries":["how to use unwrapOrElse","unwrapOrElse lazy example"],"intents":["learning","practical"],"expectedAnswer":"Use unwrapOrElse(result, fn) to extract Ok or compute default lazily","confidence":0.95},"embedding":{"semanticKeywords":["unwrapOrElse","extraction","lazy","default","result"],"conceptualTags":["lazy-evaluation","fallback"],"useCases":["expensive-defaults","conditional-computation"]},"codeSearch":{"patterns":["unwrapOrElse(result, () => ...)","unwrapOrElse(source, compute)"],"imports":["import { unwrapOrElse } from '@resultsafe/core-fp-result'"]},"learningPath":{"progression":["002-unwrap-or","005-expect-err"]},"chunking":{"type":"self-contained","section":"methods","subsection":"extraction","tokenCount":260,"relatedChunks":["002-unwrap-or","005-expect-err"]}}
 */

import { Err, Ok, unwrapOrElse } from '@resultsafe/core-fp-result';

console.log(unwrapOrElse(Ok(7), () => 0));
console.log(unwrapOrElse(Err('boom'), (e) => e.length));
