/**
 * @module 001-basic-usage
 * @title isOk Type Guard
 * @description Learn to use isOk to check if a Result is Ok. This type guard narrows the type and enables safe value access.
 * @example
 * import { Ok, Err, isOk } from '@resultsafe/core-fp-result';
 * const result = Ok(42);
 * if (isOk(result)) { console.log(result.value); }
 * @example
 * import { Ok, Err, isOk } from '@resultsafe/core-fp-result';
 * const a = Ok(42); const b = Err('boom');
 * console.log(isOk(a)); // true
 * console.log(isOk(b)); // false
 * @tags isOk,guard,type-guard,result,check,beginner
 * @since 0.1.0
 * @lastModified 2026-03-27T14:30:00Z
 * @difficulty Beginner
 * @time 5min
 * @category guards
 * @see {@link isErr} @see {@link isOkAnd} @see {@link isErrAnd}
 * @ai {"purpose":"Teach isOk type guard usage","prerequisites":["Result type","TypeScript guards"],"objectives":["isOk syntax","Type narrowing"],"rag":{"queries":["how to check if Result is Ok","isOk guard example"],"intents":["learning","practical"],"expectedAnswer":"Use isOk(result) to check if Result is Ok","confidence":0.95},"embedding":{"semanticKeywords":["isOk","guard","type-guard","result","check"],"conceptualTags":["type-narrowing","runtime-checks"],"useCases":["conditional-logic","validation"]},"codeSearch":{"patterns":["isOk(result)","if (isOk(result))"],"imports":["import { isOk } from '@resultsafe/core-fp-result'"]},"learningPath":{"progression":["002-is-err","003-is-ok-and"]},"chunking":{"type":"self-contained","section":"guards","subsection":"is-ok","tokenCount":250,"relatedChunks":["002-is-err","003-is-ok-and"]}}
 */

import { Err, Ok, isOk } from '@resultsafe/core-fp-result';

const a = Ok(42);
const b = Err('boom');

console.log('a is ok:', isOk(a));
console.log('b is ok:', isOk(b));
