/**
 * @module 002-basic
 * @title isTypedVariantOf - Type Guard with Shape Check
 * @description Learn to use isTypedVariantOf to create a type guard that checks both variant type and required properties. Enhanced narrowing for complex unions.
 * @example
 * import { isTypedVariantOf } from '@resultsafe/core-fp-result';
 * const isCreatedWithId = isTypedVariantOf('created');
 * isCreatedWithId({ type: 'created', id: '1' }); // true
 * @example
 * import { isTypedVariantOf } from '@resultsafe/core-fp-result';
 * const hasId = isTypedVariantOf('created');
 * if (hasId(event)) { console.log(event.id); }
 * @tags isTypedVariantOf,type-guard,variant,shape,advanced
 * @since 0.1.0
 * @lastModified 2026-03-27T14:30:00Z
 * @difficulty Advanced
 * @time 15min
 * @category refiners
 * @see {@link isTypedVariant} @see {@link matchVariant} @see {@link refineResult}
 * @ai {"purpose":"Teach isTypedVariantOf for shape-aware narrowing","prerequisites":["Discriminated unions","Type guards"],"objectives":["isTypedVariantOf syntax","Property checking"],"rag":{"queries":["how to use isTypedVariantOf","type guard with shape example"],"intents":["learning","practical"],"expectedAnswer":"Use isTypedVariantOf(type) to check variant and required properties","confidence":0.95},"embedding":{"semanticKeywords":["isTypedVariantOf","type-guard","variant","shape","union"],"conceptualTags":["type-narrowing","property-checks"],"useCases":["event-handling","validation"]},"codeSearch":{"patterns":["isTypedVariantOf('type')","isTypedVariantOf<T>(type)"],"imports":["import { isTypedVariantOf } from '@resultsafe/core-fp-result'"]},"learningPath":{"progression":["001-is-typed-variant","003-match-variant"]},"chunking":{"type":"self-contained","section":"refiners","subsection":"type-guards","tokenCount":270,"relatedChunks":["001-is-typed-variant","003-match-variant"]}}
 */

import { isTypedVariantOf } from '@resultsafe/core-fp-result';

const isCreatedWithId = isTypedVariantOf<'created', { id: unknown }>('created');

console.log(isCreatedWithId({ type: 'created', id: '1' }));
console.log(isCreatedWithId({ type: 'created' }));
