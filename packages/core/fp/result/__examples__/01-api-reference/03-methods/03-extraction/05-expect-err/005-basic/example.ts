/**
 * @module 005-basic
 * @title expectErr - Extract Error with Custom Panic Message
 * @description Learn to use expectErr to extract the error value with a custom panic message. Like unwrapErr but provides better error context when failing.
 * @example
 * import { Err, expectErr } from '@resultsafe/core-fp-result';
 * const error = expectErr(Err('fatal'), 'must be err');
 * console.log(error); // 'fatal'
 * @example
 * import { Ok, Err, expectErr } from '@resultsafe/core-fp-result';
 * expectErr(Err('error'), 'expected failure'); // 'error'
 * expectErr(Ok(42), 'expected failure'); // throws with message
 * @tags expectErr,extraction,error,panic,intermediate
 * @since 0.1.0
 * @lastModified 2026-03-27T14:30:00Z
 * @difficulty Intermediate
 * @time 5min
 * @category methods
 * @see {@link expect} @see {@link unwrapErr} @see {@link isErr}
 * @ai {"purpose":"Teach expectErr for error extraction with custom message","prerequisites":["Result type","unwrapErr usage"],"objectives":["expectErr syntax","Custom panic messages"],"rag":{"queries":["how to use expectErr on Result","expectErr custom message example"],"intents":["learning","practical"],"expectedAnswer":"Use expectErr(result, message) to extract Err with custom panic message","confidence":0.95},"embedding":{"semanticKeywords":["expectErr","extraction","error","panic","result"],"conceptualTags":["unsafe-extraction","debugging"],"useCases":["error-assertions","testing"]},"codeSearch":{"patterns":["expectErr(result, 'message')","expectErr(source, msg)"],"imports":["import { expectErr } from '@resultsafe/core-fp-result'"]},"learningPath":{"progression":["004-unwrap-err","006-unwrap-or-else"]},"chunking":{"type":"self-contained","section":"methods","subsection":"extraction","tokenCount":260,"relatedChunks":["004-unwrap-err","006-unwrap-or-else"]}}
 */

import { Err, expectErr } from '@resultsafe/core-fp-result';

const error = expectErr(Err('fatal'), 'must be err');
console.log(error);
