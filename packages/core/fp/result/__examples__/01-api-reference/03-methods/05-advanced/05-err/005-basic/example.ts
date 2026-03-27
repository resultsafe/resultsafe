/**
 * @module 005-basic
 * @title err - Extract Err as Boolean
 * @description Learn to use err to check if a Result is Err and return a boolean. Simple predicate for conditional logic without type narrowing.
 * @example
 * import { Ok, Err, err } from '@resultsafe/core-fp-result';
 * err(Err('x')); // true
 * err(Ok(1)); // false
 * @example
 * import { Ok, Err, err } from '@resultsafe/core-fp-result';
 * if (err(result)) { /* handle error *\/ }
 * @tags err,boolean,predicate,check,advanced
 * @since 0.1.0
 * @lastModified 2026-03-27T14:30:00Z
 * @difficulty Advanced
 * @time 5min
 * @category methods
 * @see {@link ok} @see {@link isErr} @see {@link match}
 * @ai {"purpose":"Teach err for boolean Err checking","prerequisites":["Result type"],"objectives":["err syntax","Boolean predicate"],"rag":{"queries":["how to use err on Result","err boolean check example"],"intents":["learning","practical"],"expectedAnswer":"Use err(result) to get true for Err, false for Ok","confidence":0.95},"embedding":{"semanticKeywords":["err","boolean","predicate","check","result"],"conceptualTags":["predicate","simple-check"],"useCases":["conditional-logic","filtering"]},"codeSearch":{"patterns":["err(Err(error))","err(result)"],"imports":["import { err } from '@resultsafe/core-fp-result'"]},"learningPath":{"progression":["004-ok","001-match"]},"chunking":{"type":"self-contained","section":"methods","subsection":"advanced","tokenCount":240,"relatedChunks":["004-ok","001-match"]}}
 */

import { Err, Ok, err } from '@resultsafe/core-fp-result';

console.log(err(Err('x')));
console.log(err(Ok(1)));
