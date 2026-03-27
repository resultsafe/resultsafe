/**
 * @module 001-basic-usage
 * @title mapErr - Transform Error Value
 * @description Learn to use mapErr to transform the error value of a Result. Applies a function to the error if present, preserving Ok unchanged.
 * @example
 * import { Err, mapErr } from '@resultsafe/core-fp-result';
 * const result = Err({ code: 'E_IO' });
 * const normalized = mapErr(result, e => `code:${e.code}`);
 * @example
 * import { Ok, Err, mapErr } from '@resultsafe/core-fp-result';
 * mapErr(Err('error'), e => e.toUpperCase()); // Err('ERROR')
 * mapErr(Ok(5), e => e); // Ok(5)
 * @tags mapErr,transformation,error,functional,intermediate
 * @since 0.1.0
 * @lastModified 2026-03-27T14:30:00Z
 * @difficulty Intermediate
 * @time 5min
 * @category methods
 * @see {@link map} @see {@link orElse} @see {@link tapErr}
 * @ai {"purpose":"Teach mapErr for transforming error values","prerequisites":["Result type","Error handling"],"objectives":["mapErr syntax","Error transformation"],"rag":{"queries":["how to use mapErr on Result","mapErr function example"],"intents":["learning","practical"],"expectedAnswer":"Use mapErr(result, fn) to transform Err value","confidence":0.95},"embedding":{"semanticKeywords":["mapErr","transformation","error","functional","result"],"conceptualTags":["functor","error-handling"],"useCases":["error-normalization","logging"]},"codeSearch":{"patterns":["mapErr(result, (e) => ...)","mapErr(source, mapper)"],"imports":["import { mapErr } from '@resultsafe/core-fp-result'"]},"learningPath":{"progression":["001-map","002-or-else"]},"chunking":{"type":"self-contained","section":"methods","subsection":"transformation","tokenCount":250,"relatedChunks":["001-map","002-or-else"]}}
 */

import { Err, mapErr } from '@resultsafe/core-fp-result';

const source = Err({ code: 'E_IO' });
const normalized = mapErr(source, (error) => `code:${error.code}`);

console.log(normalized);
