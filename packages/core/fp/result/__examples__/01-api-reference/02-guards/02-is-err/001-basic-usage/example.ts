/**
 * @module 001-basic-usage
 * @title isErr Type Guard
 * @description Learn to use isErr to check if a Result is Err. This type guard narrows the type and enables safe error access.
 * @example
 * import { Ok, Err, isErr } from '@resultsafe/core-fp-result';
 * const result = Err('error');
 * if (isErr(result)) { console.log(result.error); }
 * @example
 * import { Ok, Err, isErr } from '@resultsafe/core-fp-result';
 * const a = Ok(42); const b = Err('boom');
 * console.log(isErr(a)); // false
 * console.log(isErr(b)); // true
 * @tags isErr,guard,type-guard,result,check,beginner
 * @since 0.1.0
 * @lastModified 2026-03-27T14:30:00Z
 * @difficulty Beginner
 * @time 5min
 * @category guards
 * @see {@link isOk} @see {@link isOkAnd} @see {@link isErrAnd}
 * @ai {"purpose":"Teach isErr type guard usage","prerequisites":["Result type","TypeScript guards"],"objectives":["isErr syntax","Type narrowing"],"rag":{"queries":["how to check if Result is Err","isErr guard example"],"intents":["learning","practical"],"expectedAnswer":"Use isErr(result) to check if Result is Err","confidence":0.95},"embedding":{"semanticKeywords":["isErr","guard","type-guard","result","check"],"conceptualTags":["type-narrowing","runtime-checks"],"useCases":["error-handling","validation"]},"codeSearch":{"patterns":["isErr(result)","if (isErr(result))"],"imports":["import { isErr } from '@resultsafe/core-fp-result'"]},"learningPath":{"progression":["001-is-ok","003-is-ok-and"]},"chunking":{"type":"self-contained","section":"guards","subsection":"is-err","tokenCount":250,"relatedChunks":["001-is-ok","003-is-ok-and"]}}
 */

import { Err, Ok, isErr } from '@resultsafe/core-fp-result';

const a = Ok(42);
const b = Err('boom');

console.log('a is err:', isErr(a));
console.log('b is err:', isErr(b));
