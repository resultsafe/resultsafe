/**
 * @module 003-basic
 * @title matchVariant - Pattern Matching on Variants
 * @description Learn to use matchVariant for exhaustive pattern matching on discriminated union variants. Builder-style API for clean, type-safe branching.
 * @example
 * import { matchVariant } from '@resultsafe/core-fp-result';
 * const output = matchVariant(event)
 *   .with('created', (v) => `id:${v.id}`)
 *   .with('failed', (v) => `reason:${v.reason}`)
 *   .otherwise(() => 'fallback')
 *   .run();
 * @example
 * import { matchVariant } from '@resultsafe/core-fp-result';
 * matchVariant(event).with('created', handleCreated).run();
 * @tags matchVariant,pattern-matching,variant,exhaustive,advanced
 * @since 0.1.0
 * @lastModified 2026-03-27T14:30:00Z
 * @difficulty Advanced
 * @time 15min
 * @category refiners
 * @see {@link matchVariantStrict} @see {@link isTypedVariant} @see {@link refineResult}
 * @ai {"purpose":"Teach matchVariant for exhaustive variant matching","prerequisites":["Discriminated unions","Pattern matching"],"objectives":["matchVariant syntax","Builder API"],"rag":{"queries":["how to use matchVariant","pattern matching variant example"],"intents":["learning","practical"],"expectedAnswer":"Use matchVariant(event).with(type, handler).run() for exhaustive matching","confidence":0.95},"embedding":{"semanticKeywords":["matchVariant","pattern-matching","variant","exhaustive","union"],"conceptualTags":["pattern-matching","builder-pattern"],"useCases":["event-handling","state-machines"]},"codeSearch":{"patterns":["matchVariant(event).with('type', handler)","matchVariant<T>(source)"],"imports":["import { matchVariant } from '@resultsafe/core-fp-result'"]},"learningPath":{"progression":["002-is-typed-variant-of","004-match-variant-strict"]},"chunking":{"type":"self-contained","section":"refiners","subsection":"pattern-matching","tokenCount":280,"relatedChunks":["002-is-typed-variant-of","004-match-variant-strict"]}}
 */

import { matchVariant } from '@resultsafe/core-fp-result';

type Event =
  | { type: 'created'; id: string }
  | { type: 'failed'; reason: string };

const event: Event = { type: 'created', id: '42' };

const output = matchVariant<Event>(event)
  .with('created', (value) => `created:${value.id}`)
  .with('failed', (value) => `failed:${value.reason}`)
  .otherwise(() => 'fallback')
  .run();

console.log(output);
