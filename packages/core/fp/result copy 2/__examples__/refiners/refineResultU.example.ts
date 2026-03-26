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


