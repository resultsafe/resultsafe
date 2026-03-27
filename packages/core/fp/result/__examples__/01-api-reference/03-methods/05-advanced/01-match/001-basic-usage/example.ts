/**
 * @module 001-basic-usage
 * @title match - Pattern Matching on Result
 * @description Learn to use match for exhaustive pattern matching on Result. Handles both Ok and Err cases with type-safe callbacks.
 * @example
 * import { Ok, Err, match } from '@resultsafe/core-fp-result';
 * const a = match(Ok(5), (v) => `ok:${v}`, (e) => `err:${e}`);
 * const b = match(Err('boom'), (v) => `ok:${v}`, (e) => `err:${e}`);
 * @example
 * import { Ok, Err, match } from '@resultsafe/core-fp-result';
 * match(Ok(42), v => v * 2, e => 0); // 84
 * match(Err('fail'), v => v, e => -1); // -1
 * @tags match,pattern-matching,exhaustive,functional,advanced
 * @since 0.1.0
 * @lastModified 2026-03-27T14:30:00Z
 * @difficulty Advanced
 * @time 15min
 * @category methods
 * @see {@link andThen} @see {@link orElse} @see {@link isOk}
 * @ai {"purpose":"Teach match for exhaustive pattern matching","prerequisites":["Result type","Callbacks"],"objectives":["match syntax","Exhaustive handling"],"rag":{"queries":["how to use match on Result","pattern matching example"],"intents":["learning","practical"],"expectedAnswer":"Use match(result, onOk, onErr) to handle both cases exhaustively","confidence":0.95},"embedding":{"semanticKeywords":["match","pattern-matching","exhaustive","functional","result"],"conceptualTags":["pattern-matching","type-safety"],"useCases":["branching","transformation"]},"codeSearch":{"patterns":["match(result, (v) => ..., (e) => ...)","match(source, onOk, onErr)"],"imports":["import { match } from '@resultsafe/core-fp-result'"]},"learningPath":{"progression":["002-flatten","003-transpose"]},"chunking":{"type":"self-contained","section":"methods","subsection":"advanced","tokenCount":270,"relatedChunks":["002-flatten","003-transpose"]}}
 */

import { Err, Ok, match } from '@resultsafe/core-fp-result';

const a = match(
  Ok(5),
  (v) => `ok:${v}`,
  (e) => `err:${e}`,
);
const b = match(
  Err('boom'),
  (v) => `ok:${v}`,
  (e) => `err:${e}`,
);

console.log(a);
console.log(b);
