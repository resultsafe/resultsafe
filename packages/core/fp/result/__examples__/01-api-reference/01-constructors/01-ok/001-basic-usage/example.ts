/**
 * @module 001-basic-usage
 * @title Creating Ok Values
 * @description Creating successful Result values with Ok constructor for explicit success representation in functional error handling.
 * @example
 * import { Ok } from '@resultsafe/core-fp-result';
 * const result = Ok(42);
 * console.log(result); // { ok: true, value: 42 }
 * @example
 * import { Ok } from '@resultsafe/core-fp-result';
 * const result: Ok<number, string> = Ok(42);
 * console.log(result.value); // 42
 * @tags result,ok,constructor,basic,beginner
 * @since 0.1.0
 * @lastModified 2026-03-27T14:30:00Z
 * @difficulty Beginner
 * @time 5min
 * @category constructors
 * @see {@link Err} @see {@link match} @see {@link ../../CI_CD_INTEGRATION.md}
 * @ai {"purpose":"Teach Ok constructor usage","prerequisites":["TypeScript types"],"objectives":["Ok syntax","Result structure"],"rag":{"queries":["how to create Ok result","Ok constructor example"],"intents":["learning","practical"],"expectedAnswer":"Use Ok(value) to create success result","confidence":0.95},"embedding":{"semanticKeywords":["result","ok","constructor","success"],"conceptualTags":["explicit-errors","type-safety"],"useCases":["api-response","validation"]},"codeSearch":{"patterns":["Ok(value)","Ok<T>(value)"],"imports":["import { Ok } from @resultsafe/core-fp-result'"]},"learningPath":{"progression":["002-with-generics","003-real-world"]},"chunking":{"type":"self-contained","section":"constructors","subsection":"ok","tokenCount":300,"relatedChunks":["002-with-generics","003-real-world"]}}
 */

import { Ok } from '@resultsafe/core-fp-result';

const result = Ok(42);
console.log(result); // { ok: true, value: 42 }
