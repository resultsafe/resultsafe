/**
 * @module 004-basic
 * @title matchVariantStrict - Exhaustive Pattern Matching
 * @description Learn to use matchVariantStrict for strictly exhaustive pattern matching without fallback. Type-safe matching that requires all variants to be handled.
 * @example
 * import { matchVariantStrict } from '@resultsafe/core-fp-result';
 * const output = matchVariantStrict(event)
 *   .with('created', (v) => `id:${v.id}`)
 *   .with('failed', (v) => `reason:${v.reason}`)
 *   .run();
 * @example
 * import { matchVariantStrict } from '@resultsafe/core-fp-result';
 * matchVariantStrict(event).with('created', handleCreated).run();
 * @tags matchVariantStrict,pattern-matching,exhaustive,type-safe,advanced
 * @since 0.1.0
 * @lastModified 2026-03-27T14:30:00Z
 * @difficulty Advanced
 * @time 15min
 * @category refiners
 * @see {@link matchVariant} @see {@link isTypedVariant} @see {@link refineResult}
 * @ai {"purpose":"Teach matchVariantStrict for exhaustive matching without fallback","prerequisites":["Discriminated unions","Pattern matching"],"objectives":["matchVariantStrict syntax","Exhaustive handling"],"rag":{"queries":["how to use matchVariantStrict","strict pattern matching example"],"intents":["learning","practical"],"expectedAnswer":"Use matchVariantStrict(event).with(type, handler).run() for strict matching","confidence":0.95},"embedding":{"semanticKeywords":["matchVariantStrict","pattern-matching","exhaustive","type-safe","union"],"conceptualTags":["pattern-matching","exhaustiveness"],"useCases":["event-handling","state-machines"]},"codeSearch":{"patterns":["matchVariantStrict(event).with('type', handler)","matchVariantStrict<T>(source)"],"imports":["import { matchVariantStrict } from '@resultsafe/core-fp-result'"]},"learningPath":{"progression":["003-match-variant","005-refine-result"]},"chunking":{"type":"self-contained","section":"refiners","subsection":"pattern-matching","tokenCount":280,"relatedChunks":["003-match-variant","005-refine-result"]}}
 */

import { matchVariantStrict } from '@resultsafe/core-fp-result';

type Event =
  | { type: 'created'; id: string }
  | { type: 'failed'; reason: string };

const event: Event = { type: 'failed', reason: 'timeout' };

const output = matchVariantStrict<Event>(event)
  .with('created', (value) => `created:${value.id}`)
  .with('failed', (value) => `failed:${value.reason}`)
  .run();

console.log(output);
