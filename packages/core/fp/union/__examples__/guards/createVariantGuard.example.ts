import type { VariantShape } from '@resultsafe/core-fp-union';
import { isVariant } from '@resultsafe/core-fp-union';

const variantMap = {
  ok: { payload: ['value', 'meta'], forbidden: 'error', strictFields: true },
  err: { payload: ['code', 'message'], forbidden: 'value', strictFields: true },
} as const;

type Ok = VariantShape<typeof variantMap, 'ok'>;

const isOk = isVariant(variantMap)('ok');

const values: unknown[] = [
  { type: 'ok', value: 42, meta: { source: 'api' } },
  { type: 'ok', value: 'oops', meta: { source: 'api' } },
  { type: 'err', code: 500, message: 'fail' },
];

const filtered = values.filter(isOk);
// filtered: Array<Ok>

for (const r of filtered) {
  console.log('type:', r.type);
  console.log('value:', r.value);
  console.log('meta:', r.meta);
}


