/**
 * @module 009-basic
 * @title refineVariantMap - Validate Multiple Variants
 * @description Learn to use refineVariantMap for runtime validation across multiple variant types. Single API for validating any variant in a union with comprehensive validators.
 * @example
 * import { refineVariantMap } from '@resultsafe/core-fp-result';
 * const result = refineVariantMap(data, variantMap, validators);
 * console.log(result); // Ok or Err based on validation
 * @example
 * import { refineVariantMap } from '@resultsafe/core-fp-result';
 * refineVariantMap({ type: 'created', id: '1', meta: 2 }, map, validators);
 * @tags refineVariantMap,validation,multi-variant,runtime,advanced
 * @since 0.1.0
 * @lastModified 2026-03-27T14:30:00Z
 * @difficulty Advanced
 * @time 15min
 * @category refiners
 * @see {@link refineResult} @see {@link refineResultU} @see {@link matchVariant}
 * @ai {"purpose":"Teach refineVariantMap for multi-variant validation","prerequisites":["Result type","Type predicates"],"objectives":["refineVariantMap syntax","Multi-variant validation"],"rag":{"queries":["how to use refineVariantMap","multi-variant validation example"],"intents":["learning","practical"],"expectedAnswer":"Use refineVariantMap(data, map, validators) for comprehensive validation","confidence":0.95},"embedding":{"semanticKeywords":["refineVariantMap","validation","multi-variant","runtime","union"],"conceptualTags":["runtime-validation","comprehensive"],"useCases":["api-validation","schema-validation"]},"codeSearch":{"patterns":["refineVariantMap(data, map, validators)","refineVariantMap(source, ...)"],"imports":["import { refineVariantMap } from '@resultsafe/core-fp-result'"]},"learningPath":{"progression":["008-refine-async-result-u","005-refine-result"]},"chunking":{"type":"self-contained","section":"refiners","subsection":"validation","tokenCount":280,"relatedChunks":["008-refine-async-result-u","005-refine-result"]}}
 */

import { refineVariantMap } from '@resultsafe/core-fp-result';

const variantMap = {
  created: { payload: ['id', 'meta'] },
  failed: { payload: 'reason' },
  ping: { payload: 'never' },
} as const;

const validators = {
  created: {
    id: (value: unknown): value is string => typeof value === 'string',
    meta: (value: unknown): value is number => typeof value === 'number',
  },
  failed: {
    reason: (value: unknown): value is string => typeof value === 'string',
  },
  ping: {},
} as const;

console.log(
  refineVariantMap(
    { type: 'created', id: '1', meta: 2 },
    variantMap,
    validators,
  ),
);
console.log(
  refineVariantMap({ type: 'failed', reason: 2 }, variantMap, validators),
);
