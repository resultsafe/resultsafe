/**
 * @module 003-basic
 * @title transpose - Convert Result<Option<T>> to Option<Result<T>>
 * @description Learn to use transpose to convert between Result<Option<T>> and Option<Result<T>>. Enables working with combined types in functional pipelines.
 * @example
 * import { Ok, Err, transpose } from '@resultsafe/core-fp-result';
 * transpose(Ok({ some: true, value: 5 })); // { some: true, value: Ok(5) }
 * transpose(Ok({ some: false })); // { some: false }
 * transpose(Err('boom')); // Err('boom')
 * @example
 * import { Ok, transpose } from '@resultsafe/core-fp-result';
 * const optResult = transpose(Ok({ some: true, value: 42 }));
 * // { some: true, value: Ok(42) }
 * @tags transpose,option,conversion,functional,advanced
 * @since 0.1.0
 * @lastModified 2026-03-27T14:30:00Z
 * @difficulty Advanced
 * @time 15min
 * @category methods
 * @see {@link flatten} @see {@link match} @see {@link ok}
 * @ai {"purpose":"Teach transpose for Result/Option conversion","prerequisites":["Result type","Option type"],"objectives":["transpose syntax","Type conversion"],"rag":{"queries":["how to transpose Result Option","transpose conversion example"],"intents":["learning","practical"],"expectedAnswer":"Use transpose(result) to convert Result<Option<T>> to Option<Result<T>>","confidence":0.95},"embedding":{"semanticKeywords":["transpose","option","conversion","functional","result"],"conceptualTags":["type-conversion","composition"],"useCases":["optional-results","pipeline"]},"codeSearch":{"patterns":["transpose(Ok({ some: true, value: ... }))","transpose(source)"],"imports":["import { transpose } from '@resultsafe/core-fp-result'"]},"learningPath":{"progression":["002-flatten","004-ok"]},"chunking":{"type":"self-contained","section":"methods","subsection":"advanced","tokenCount":270,"relatedChunks":["002-flatten","004-ok"]}}
 */

import { Err, Ok, transpose } from '@resultsafe/core-fp-result';

console.log(transpose(Ok({ some: true, value: 5 })));
console.log(transpose(Ok({ some: false })));
console.log(transpose(Err('boom')));
