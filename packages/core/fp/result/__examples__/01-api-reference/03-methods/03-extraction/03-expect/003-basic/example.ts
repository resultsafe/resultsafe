/**
 * @module 003-basic
 * @title expect - Extract with Custom Panic Message
 * @description Learn to use expect to extract the Ok value with a custom panic message. Like unwrap but provides better error context when failing.
 * @example
 * import { Ok, expect } from '@resultsafe/core-fp-result';
 * const value = expect(Ok('ready'), 'must be ok');
 * console.log(value); // 'ready'
 * @example
 * import { Ok, Err, expect } from '@resultsafe/core-fp-result';
 * expect(Ok(42), 'expected success'); // 42
 * expect(Err('error'), 'expected success'); // throws with message
 * @tags expect,extraction,panic,message,intermediate
 * @since 0.1.0
 * @lastModified 2026-03-27T14:30:00Z
 * @difficulty Intermediate
 * @time 5min
 * @category methods
 * @see {@link unwrap} @see {@link expectErr} @see {@link unwrapOr}
 * @ai {"purpose":"Teach expect for extraction with custom message","prerequisites":["Result type","unwrap usage"],"objectives":["expect syntax","Custom panic messages"],"rag":{"queries":["how to use expect on Result","expect custom message example"],"intents":["learning","practical"],"expectedAnswer":"Use expect(result, message) to extract Ok with custom panic message","confidence":0.95},"embedding":{"semanticKeywords":["expect","extraction","panic","message","result"],"conceptualTags":["unsafe-extraction","debugging"],"useCases":["assertions","testing"]},"codeSearch":{"patterns":["expect(result, 'message')","expect(source, msg)"],"imports":["import { expect } from '@resultsafe/core-fp-result'"]},"learningPath":{"progression":["001-unwrap","004-unwrap-err"]},"chunking":{"type":"self-contained","section":"methods","subsection":"extraction","tokenCount":260,"relatedChunks":["001-unwrap","004-unwrap-err"]}}
 */

import { Ok, expect } from '@resultsafe/core-fp-result';

const value = expect(Ok('ready'), 'must be ok');
console.log(value);
