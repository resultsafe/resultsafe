/**
 * @module 002-basic
 * @title flatten - Flatten Nested Result
 * @description Learn to use flatten to collapse nested Result types. Converts Result<Result<T, E>, E> into Result<T, E> for cleaner chaining.
 * @example
 * import { Ok, Err, flatten } from '@resultsafe/core-fp-result';
 * flatten(Ok(Ok(10))); // Ok(10)
 * flatten(Ok(Err('inner'))); // Err('inner')
 * flatten(Err('outer')); // Err('outer')
 * @example
 * import { Ok, Err, flatten } from '@resultsafe/core-fp-result';
 * const nested = Ok(Ok(42));
 * const flat = flatten(nested); // Ok(42)
 * @tags flatten,nested,chaining,monad,advanced
 * @since 0.1.0
 * @lastModified 2026-03-27T14:30:00Z
 * @difficulty Advanced
 * @time 15min
 * @category methods
 * @see {@link andThen} @see {@link match} @see {@link transpose}
 * @ai {"purpose":"Teach flatten for collapsing nested Result types","prerequisites":["Result type","Nested types"],"objectives":["flatten syntax","Nested Result handling"],"rag":{"queries":["how to flatten nested Result","flatten monad example"],"intents":["learning","practical"],"expectedAnswer":"Use flatten(result) to collapse Result<Result<T>> into Result<T>","confidence":0.95},"embedding":{"semanticKeywords":["flatten","nested","chaining","monad","result"],"conceptualTags":["monadic-join","type-level"],"useCases":["deep-chaining","composition"]},"codeSearch":{"patterns":["flatten(Ok(Ok(value)))","flatten(nested)"],"imports":["import { flatten } from '@resultsafe/core-fp-result'"]},"learningPath":{"progression":["001-match","003-transpose"]},"chunking":{"type":"self-contained","section":"methods","subsection":"advanced","tokenCount":260,"relatedChunks":["001-match","003-transpose"]}}
 */

import { Err, Ok, flatten } from '@resultsafe/core-fp-result';

console.log(flatten(Ok(Ok(10))));
console.log(flatten(Ok(Err('inner'))));
console.log(flatten(Err('outer')));
