import { isVariantOfType } from '@resultsafe/core-fp-union';

const variantMap = {
  ok: { payload: ['value', 'meta'], forbidden: 'error', strictFields: true },
  err: { payload: ['code', 'message'], forbidden: 'value', strictFields: true },
} as const;

const isOk = isVariantOfType(variantMap)('ok');
const isErr = isVariantOfType(variantMap)('err');

const values: unknown[] = [
  { type: 'ok', value: 123, meta: { source: 'api' } },
  { type: 'err', code: 500, message: 'fail' },
  { type: 'ok', value: 'oops' }, // ❌ нет meta
];

const oks = values.filter(isOk);
const errs = values.filter(isErr);

for (const r of oks) {
  console.log('✅ ok:', r.value, r.meta);
}

for (const r of errs) {
  console.log('❌ err:', r.code, r.message);
}


