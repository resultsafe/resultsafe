/**
 * @module 008-basic
 * @title refineAsyncResultU - Uncurried Async Validation
 * @description Learn to use refineAsyncResultU for async runtime validation with uncurried API. Single function call variant of refineAsyncResult for simpler syntax.
 * @example
 * import { refineAsyncResultU } from '@resultsafe/core-fp-result';
 * const refined = await refineAsyncResultU(data, 'created', variantMap, {
 *   id: async (v) => typeof v === 'string',
 *   meta: async (v) => typeof v === 'number',
 * });
 * @example
 * import { refineAsyncResultU } from '@resultsafe/core-fp-result';
 * await refineAsyncResultU({ type: 'created', id: '42' }, 'created', map, validators);
 * @tags refineAsyncResultU,validation,async,uncurried,advanced
 * @since 0.1.0
 * @lastModified 2026-03-27T14:30:00Z
 * @difficulty Advanced
 * @time 15min
 * @category refiners
 * @see {@link refineAsyncResult} @see {@link refineResultU} @see {@link refineVariantMap}
 * @ai {"purpose":"Teach refineAsyncResultU for uncurried async validation","prerequisites":["Result type","Async functions"],"objectives":["refineAsyncResultU syntax","Uncurried async validation"],"rag":{"queries":["how to use refineAsyncResultU","async uncurried validation example"],"intents":["learning","practical"],"expectedAnswer":"Use refineAsyncResultU(data, type, map, asyncValidators) for async validation","confidence":0.95},"embedding":{"semanticKeywords":["refineAsyncResultU","validation","async","uncurried","result"],"conceptualTags":["async-validation","api-design"],"useCases":["api-validation","database-lookup"]},"codeSearch":{"patterns":["refineAsyncResultU(data, type, map, validators)","refineAsyncResultU(source, ...)"],"imports":["import { refineAsyncResultU } from '@resultsafe/core-fp-result'"]},"learningPath":{"progression":["007-refine-async-result","009-refine-variant-map"]},"chunking":{"type":"self-contained","section":"refiners","subsection":"validation","tokenCount":280,"relatedChunks":["007-refine-async-result","009-refine-variant-map"]}}
 */

import { refineAsyncResultU } from '@resultsafe/core-fp-result';

const variantMap = {
  created: { payload: ['id', 'meta'] },
  failed: { payload: 'reason' },
} as const;

async function main(): Promise<void> {
  const refined = await refineAsyncResultU(
    { type: 'created', id: '42', meta: 1 },
    'created',
    variantMap,
    {
      id: async (value: unknown) => typeof value === 'string',
      meta: async (value: unknown) => typeof value === 'number',
    },
  );

  console.log(refined);
}

await main();
