/**
 * @module 001-hello-world
 * @title Hello World with Result
 * @description Your first 30 seconds with Result type. Learn to create success and error values with Ok and Err constructors.
 * @example
 * import { Ok, Err } from '@resultsafe/core-fp-result';
 * const success = Ok(42);
 * const failure = Err('error');
 * console.log(success, failure);
 * @example
 * import { Ok } from '@resultsafe/core-fp-result';
 * console.log(Ok(42)); // { ok: true, value: 42 }
 * @tags result,ok,err,hello-world,beginner
 * @since 0.1.0
 * @lastModified 2026-03-27T14:30:00Z
 * @difficulty Beginner
 * @time 1min
 * @category quick-start
 * @see {@link 002-basic-usage} @see {@link ../CI_CD_INTEGRATION.md}
 * @ai {"purpose":"Introduce Result type in 30 seconds","prerequisites":[],"objectives":["Ok constructor","Err constructor"],"rag":{"queries":["Result hello world","Result quick start"],"intents":["learning","quick-start"],"expectedAnswer":"Use Ok for success, Err for errors","confidence":0.95},"embedding":{"semanticKeywords":["result","ok","err","hello-world","beginner"],"conceptualTags":["getting-started","basics"],"useCases":["introduction","tutorial"]},"codeSearch":{"patterns":["Ok(value)","Err(error)"],"imports":["import { Ok, Err } from @resultsafe/core-fp-result'"]},"learningPath":{"progression":["002-basic-usage","003-error-handling"]},"chunking":{"type":"self-contained","section":"quick-start","subsection":"hello-world","tokenCount":200,"relatedChunks":["002-basic-usage"]}}
 */

import { Err, Ok } from '@resultsafe/core-fp-result';

const success = Ok(42);
console.log('Success:', success);

const failure = Err('Something went wrong');
console.log('Failure:', failure);
