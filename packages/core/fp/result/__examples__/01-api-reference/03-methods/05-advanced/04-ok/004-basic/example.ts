/**
 * @module 004-basic
 * @title ok - Extract Ok as Boolean
 * @description Learn to use ok to check if a Result is Ok and return a boolean. Simple predicate for conditional logic without type narrowing.
 * @example
 * import { Ok, Err, ok } from '@resultsafe/core-fp-result';
 * ok(Ok(1)); // true
 * ok(Err('x')); // false
 * @example
 * import { Ok, Err, ok } from '@resultsafe/core-fp-result';
 * if (ok(result)) { /* handle success *\/ }
 * @tags ok,boolean,predicate,check,advanced
 * @since 0.1.0
 * @lastModified 2026-03-27T14:30:00Z
 * @difficulty Advanced
 * @time 5min
 * @category methods
 * @see {@link err} @see {@link isOk} @see {@link match}
 * @ai {"purpose":"Teach ok for boolean Ok checking","prerequisites":["Result type"],"objectives":["ok syntax","Boolean predicate"],"rag":{"queries":["how to use ok on Result","ok boolean check example"],"intents":["learning","practical"],"expectedAnswer":"Use ok(result) to get true for Ok, false for Err","confidence":0.95},"embedding":{"semanticKeywords":["ok","boolean","predicate","check","result"],"conceptualTags":["predicate","simple-check"],"useCases":["conditional-logic","filtering"]},"codeSearch":{"patterns":["ok(Ok(value))","ok(result)"],"imports":["import { ok } from '@resultsafe/core-fp-result'"]},"learningPath":{"progression":["003-transpose","005-err"]},"chunking":{"type":"self-contained","section":"methods","subsection":"advanced","tokenCount":240,"relatedChunks":["003-transpose","005-err"]}}
 */

import { Err, Ok, ok } from '@resultsafe/core-fp-result';

console.log(ok(Ok(1)));
console.log(ok(Err('x')));
