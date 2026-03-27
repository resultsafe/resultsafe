/**
 * @module 006-basic
 * @title refineResultU - Uncurried Runtime Validation
 * @description Learn to use refineResultU for runtime validation with uncurried API. Single function call variant of refineResult for simpler syntax.
 * @example
 * import { refineResultU } from '@resultsafe/core-fp-result';
 * const refined = refineResultU(data, 'created', variantMap, {
 *   id: (v): v is string => typeof v === 'string',
 *   meta: (v): v is number => typeof v === 'number',
 * });
 * @example
 * import { refineResultU } from '@resultsafe/core-fp-result';
 * refineResultU({ type: 'created', id: '42' }, 'created', map, validators);
 * @tags refineResultU,validation,runtime,uncurried,advanced
 * @since 0.1.0
 * @lastModified 2026-03-27T14:30:00Z
 * @difficulty Advanced
 * @time 15min
 * @category refiners
 * @see {@link refineResult} @see {@link refineAsyncResultU} @see {@link refineVariantMap}
 * @ai {"purpose":"Teach refineResultU for uncurried runtime validation","prerequisites":["Result type","Type predicates"],"objectives":["refineResultU syntax","Uncurried validation"],"rag":{"queries":["how to use refineResultU","uncurried validation example"],"intents":["learning","practical"],"expectedAnswer":"Use refineResultU(data, type, map, validators) for validation","confidence":0.95},"embedding":{"semanticKeywords":["refineResultU","validation","runtime","uncurried","result"],"conceptualTags":["runtime-validation","api-design"],"useCases":["api-validation","data-parsing"]},"codeSearch":{"patterns":["refineResultU(data, type, map, validators)","refineResultU(source, ...)"],"imports":["import { refineResultU } from '@resultsafe/core-fp-result'"]},"learningPath":{"progression":["005-refine-result","007-refine-async-result"]},"chunking":{"type":"self-contained","section":"refiners","subsection":"validation","tokenCount":280,"relatedChunks":["005-refine-result","007-refine-async-result"]}}
 */

import { refineResultU } from '@resultsafe/core-fp-result';

const variantMap = {
  created: { payload: ['id', 'meta'] },
  failed: { payload: 'reason' },
} as const;

const refined = refineResultU(
  { type: 'created', id: '42', meta: 1 },
  'created',
  variantMap,
  {
    id: (value: unknown): value is string => typeof value === 'string',
    meta: (value: unknown): value is number => typeof value === 'number',
  },
);

console.log(refined);
