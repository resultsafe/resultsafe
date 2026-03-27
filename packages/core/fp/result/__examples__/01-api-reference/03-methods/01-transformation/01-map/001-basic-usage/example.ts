/**
 * @module 001-basic-usage
 * @title map - Transform Ok Value
 * @description Learn to use map to transform the Ok value of a Result. Applies a function to the value if present, preserving Err unchanged.
 * @example
 * import { Ok, map } from '@resultsafe/core-fp-result';
 * const result = Ok(21);
 * const doubled = map(result, v => v * 2);
 * console.log(doubled); // { ok: true, value: 42 }
 * @example
 * import { Ok, Err, map } from '@resultsafe/core-fp-result';
 * map(Ok(5), x => x * 2); // Ok(10)
 * map(Err('error'), x => x * 2); // Err('error')
 * @tags map,transformation,functional,result,beginner
 * @since 0.1.0
 * @lastModified 2026-03-27T14:30:00Z
 * @difficulty Beginner
 * @time 5min
 * @category methods
 * @see {@link mapErr} @see {@link andThen} @see {@link orElse}
 * @ai {"purpose":"Teach map for transforming Ok values","prerequisites":["Result type","Function mapping"],"objectives":["map syntax","Value transformation"],"rag":{"queries":["how to use map on Result","map function example"],"intents":["learning","practical"],"expectedAnswer":"Use map(result, fn) to transform Ok value","confidence":0.95},"embedding":{"semanticKeywords":["map","transformation","functional","result","value"],"conceptualTags":["functor","immutability"],"useCases":["data-processing","pipeline"]},"codeSearch":{"patterns":["map(result, (v) => ...)","map(source, mapper)"],"imports":["import { map } from '@resultsafe/core-fp-result'"]},"learningPath":{"progression":["002-map-err","003-and-then"]},"chunking":{"type":"self-contained","section":"methods","subsection":"transformation","tokenCount":250,"relatedChunks":["002-map-err","003-and-then"]}}
 */

import { Ok, map } from '@resultsafe/core-fp-result';

const source = Ok(21);
const doubled = map(source, (value) => value * 2);

console.log(doubled);
