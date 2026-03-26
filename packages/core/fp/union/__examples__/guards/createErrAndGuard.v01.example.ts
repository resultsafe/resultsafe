import { isErrAnd } from '@resultsafe/core-fp-union';

const variantMap = {
  err: {
    payload: ['code', 'message'],
    forbidden: 'value',
    strictFields: true,
  },
} as const;

const isServerError = isErrAnd(variantMap)(
  (v): v is typeof v & { code: number } =>
    typeof v.code === 'number' && v.code >= 500,
);

const values: unknown[] = [
  { type: 'err', code: 404, message: 'Not found' },
  { type: 'err', code: 500, message: 'Internal error' },
  { type: 'err', code: 503, message: 'Service unavailable' },
  { type: 'err', code: 'oops', message: 'Bad format' },
];

const filtered = values.filter(isServerError);

for (const err of filtered) {
  console.log(`❌ Server error ${err.code}: ${err.message}`);
}


