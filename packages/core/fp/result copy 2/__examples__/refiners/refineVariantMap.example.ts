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

console.log(refineVariantMap({ type: 'created', id: '1', meta: 2 }, variantMap, validators));
console.log(refineVariantMap({ type: 'failed', reason: 2 }, variantMap, validators));


