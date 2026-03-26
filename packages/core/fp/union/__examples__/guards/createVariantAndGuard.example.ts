import { isVariantAnd } from '@resultsafe/core-fp-union';

const variantMap = {
  ok: { payload: ['value', 'meta'], forbidden: 'error', strictFields: true },
  err: { payload: ['code', 'message'], forbidden: 'value', strictFields: true },
} as const;

const isOkWithMeta = isVariantAnd(variantMap)(
  'ok',
  (v): v is typeof v & { meta: { source: string } } =>
    typeof v.meta === 'object' &&
    v.meta !== null &&
    'source' in v.meta &&
    typeof (v.meta as { source?: unknown }).source === 'string',
  {
    value: (x: unknown): x is number => typeof x === 'number',
    meta: (x: unknown): x is { source: string } =>
      typeof x === 'object' &&
      x !== null &&
      'source' in x &&
      typeof (x as { source?: unknown }).source === 'string',
  },
);

const values: unknown[] = [
  { type: 'ok', value: 42, meta: { source: 'api' } },
  { type: 'ok', value: 'oops', meta: { source: 'api' } },
  { type: 'err', code: 500, message: 'fail' },
];

const filtered = values.filter(isOkWithMeta);

for (const r of filtered) {
  console.log('✅ OK with meta:', r.meta.source);
}


