/**
 * @module 001-basic-usage
 * @title andThen - Chain Result Operations
 * @description Learn to use andThen to chain Result-returning functions. Flatmaps the result, enabling sequential operations without nesting.
 * @example
 * import { Ok, andThen } from '@resultsafe/core-fp-result';
 * const parsePort = (raw) => Ok(Number(raw));
 * andThen(Ok('8080'), parsePort); // Ok(8080)
 * @example
 * import { Ok, Err, andThen } from '@resultsafe/core-fp-result';
 * const divide = (x) => x === 0 ? Err('zero') : Ok(10/x);
 * andThen(Ok(2), divide); // Ok(5)
 * andThen(Ok(0), divide); // Err('zero')
 * @tags andThen,chaining,flatmap,result,monad,intermediate
 * @since 0.1.0
 * @lastModified 2026-03-27T14:30:00Z
 * @difficulty Intermediate
 * @time 5min
 * @category methods
 * @see {@link orElse} @see {@link map} @see {@link flatten}
 * @ai {"purpose":"Teach andThen for chaining Result operations","prerequisites":["Result type","Function composition"],"objectives":["andThen syntax","Chaining pattern"],"rag":{"queries":["how to chain Result operations","andThen flatmap example"],"intents":["learning","practical"],"expectedAnswer":"Use andThen(result, fn) to chain Result-returning functions","confidence":0.95},"embedding":{"semanticKeywords":["andThen","chaining","flatmap","result","monad"],"conceptualTags":["monadic-bind","composition"],"useCases":["validation-pipeline","async-chain"]},"codeSearch":{"patterns":["andThen(result, (v) => ...)","andThen(source, fn)"],"imports":["import { andThen } from '@resultsafe/core-fp-result'"]},"learningPath":{"progression":["002-or-else","001-map"]},"chunking":{"type":"self-contained","section":"methods","subsection":"chaining","tokenCount":270,"relatedChunks":["002-or-else","001-map"]}}
 */

import { Err, Ok, andThen } from '@resultsafe/core-fp-result';

const parsePort = (raw: string) => {
  const port = Number(raw);
  return Number.isInteger(port) ? Ok(port) : Err('invalid-port');
};

const value = andThen(Ok('8080'), parsePort);
console.log(value);
