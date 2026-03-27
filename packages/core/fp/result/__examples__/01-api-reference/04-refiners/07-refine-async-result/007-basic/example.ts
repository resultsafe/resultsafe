/**
 * @module 007-basic
 * @title refineAsyncResult - Async Runtime Validation
 * @description Learn to use refineAsyncResult for async runtime validation of variant data. Returns Promise<Result> with validated data or validation error.
 * @example
 * import { refineAsyncResult } from '@resultsafe/core-fp-result';
 * const refineCreated = refineAsyncResult(variantMap)('created')({
 *   id: async (v) => typeof v === 'string',
 *   meta: async (v) => typeof v === 'number',
 * });
 * await refineCreated({ type: 'created', id: '42', meta: 1 });
 * @example
 * import { refineAsyncResult } from '@resultsafe/core-fp-result';
 * const result = await refineCreated({ type: 'created', id: 42 }); // Err
 * @tags refineAsyncResult,validation,async,result,advanced
 * @since 0.1.0
 * @lastModified 2026-03-27T14:30:00Z
 * @difficulty Advanced
 * @time 15min
 * @category refiners
 * @see {@link refineResult} @see {@link refineAsyncResultU} @see {@link refineVariantMap}
 * @ai {"purpose":"Teach refineAsyncResult for async runtime validation","prerequisites":["Result type","Async functions"],"objectives":["refineAsyncResult syntax","Async validation"],"rag":{"queries":["how to use refineAsyncResult","async validation example"],"intents":["learning","practical"],"expectedAnswer":"Use refineAsyncResult(map)(type)(asyncValidators) for async validation","confidence":0.95},"embedding":{"semanticKeywords":["refineAsyncResult","validation","async","result","promise"],"conceptualTags":["async-validation","type-safety"],"useCases":["api-validation","database-lookup"]},"codeSearch":{"patterns":["refineAsyncResult(map)(type)(validators)","refineAsyncResult(variantMap)"],"imports":["import { refineAsyncResult } from '@resultsafe/core-fp-result'"]},"learningPath":{"progression":["006-refine-result-u","008-refine-async-result-u"]},"chunking":{"type":"self-contained","section":"refiners","subsection":"validation","tokenCount":280,"relatedChunks":["006-refine-result-u","008-refine-async-result-u"]}}
 */

import { refineAsyncResult } from '@resultsafe/core-fp-result';

const variantMap = {
  created: { payload: ['id', 'meta'] },
  failed: { payload: 'reason' },
} as const;

async function main(): Promise<void> {
  const refineCreated = refineAsyncResult(variantMap)('created')({
    id: async (value: unknown) => typeof value === 'string',
    meta: async (value: unknown) => typeof value === 'number',
  });

  console.log(await refineCreated({ type: 'created', id: '42', meta: 1 }));
  console.log(await refineCreated({ type: 'created', id: 42, meta: 1 }));
}

await main();
