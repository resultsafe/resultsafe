/**
 * @module 001-basic-usage
 * @title isTypedVariant - Type Guard for Variant
 * @description Learn to use isTypedVariant to create a type guard for a specific variant type. Narrows discriminated union types at runtime.
 * @example
 * import { isTypedVariant } from '@resultsafe/core-fp-result';
 * const isCreated = isTypedVariant('created');
 * isCreated({ type: 'created', id: '1' }); // true
 * @example
 * import { isTypedVariant } from '@resultsafe/core-fp-result';
 * const isDeleted = isTypedVariant('deleted');
 * if (isDeleted(event)) { /* handle deleted *\/ }
 * @tags isTypedVariant,type-guard,variant,narrowing,intermediate
 * @since 0.1.0
 * @lastModified 2026-03-27T14:30:00Z
 * @difficulty Intermediate
 * @time 5min
 * @category refiners
 * @see {@link isTypedVariantOf} @see {@link matchVariant} @see {@link refineResult}
 * @ai {"purpose":"Teach isTypedVariant for type narrowing","prerequisites":["Discriminated unions","Type guards"],"objectives":["isTypedVariant syntax","Variant narrowing"],"rag":{"queries":["how to use isTypedVariant","type guard variant example"],"intents":["learning","practical"],"expectedAnswer":"Use isTypedVariant(type) to create a type guard for a variant","confidence":0.95},"embedding":{"semanticKeywords":["isTypedVariant","type-guard","variant","narrowing","union"],"conceptualTags":["type-narrowing","runtime-checks"],"useCases":["event-handling","state-machines"]},"codeSearch":{"patterns":["isTypedVariant('type')","isTypedVariant(typeName)"],"imports":["import { isTypedVariant } from '@resultsafe/core-fp-result'"]},"learningPath":{"progression":["002-is-typed-variant-of","003-match-variant"]},"chunking":{"type":"self-contained","section":"refiners","subsection":"type-guards","tokenCount":260,"relatedChunks":["002-is-typed-variant-of","003-match-variant"]}}
 */

import { isTypedVariant } from '@resultsafe/core-fp-result';

const isCreated = isTypedVariant('created');

console.log(isCreated({ type: 'created', id: '1' }));
console.log(isCreated({ type: 'deleted', id: '1' }));
