/**
 * @module 005-basic
 * @title refineResult - Runtime Validation with Result
 * @description Learn to use refineResult for runtime validation of variant data. Returns Result with validated data or validation error.
 * @example
 * import { refineResult } from '@resultsafe/core-fp-result';
 * const refineCreated = refineResult(variantMap)('created')({
 *   id: (v): v is string => typeof v === 'string',
 *   meta: (v): v is number => typeof v === 'number',
 * });
 * refineCreated({ type: 'created', id: '42', meta: 1 }); // Ok
 * @example
 * import { refineResult } from '@resultsafe/core-fp-result';
 * const result = refineCreated({ type: 'created', id: 42, meta: 1 }); // Err
 * @tags refineResult,validation,runtime,result,advanced
 * @since 0.1.0
 * @lastModified 2026-03-27T14:30:00Z
 * @difficulty Advanced
 * @time 15min
 * @category refiners
 * @see {@link refineResultU} @see {@link refineAsyncResult} @see {@link refineVariantMap}
 * @ai {"purpose":"Teach refineResult for runtime validation","prerequisites":["Result type","Type predicates"],"objectives":["refineResult syntax","Validation pattern"],"rag":{"queries":["how to use refineResult","runtime validation example"],"intents":["learning","practical"],"expectedAnswer":"Use refineResult(map)(type)(validators) for runtime validation","confidence":0.95},"embedding":{"semanticKeywords":["refineResult","validation","runtime","result","predicate"],"conceptualTags":["runtime-validation","type-safety"],"useCases":["api-validation","data-parsing"]},"codeSearch":{"patterns":["refineResult(map)(type)(validators)","refineResult(variantMap)"],"imports":["import { refineResult } from '@resultsafe/core-fp-result'"]},"learningPath":{"progression":["004-match-variant-strict","006-refine-result-u"]},"chunking":{"type":"self-contained","section":"refiners","subsection":"validation","tokenCount":280,"relatedChunks":["004-match-variant-strict","006-refine-result-u"]}}
 */

import { refineResult } from '@resultsafe/core-fp-result';

const variantMap = {
  created: { payload: ['id', 'meta'] },
  failed: { payload: 'reason' },
} as const;

const refineCreated = refineResult(variantMap)('created')({
  id: (value: unknown): value is string => typeof value === 'string',
  meta: (value: unknown): value is number => typeof value === 'number',
});

console.log(refineCreated({ type: 'created', id: '42', meta: 1 }));
console.log(refineCreated({ type: 'created', id: 42, meta: 1 }));
