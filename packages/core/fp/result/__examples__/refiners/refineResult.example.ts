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


