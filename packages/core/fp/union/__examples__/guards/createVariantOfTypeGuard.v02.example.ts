import { isVariantOfType } from '@resultsafe/core-fp-union';

const variantMap = {
  ok: { payload: ['value', 'meta'], forbidden: 'error', strictFields: true },
  err: { payload: ['code', 'message'], forbidden: 'value', strictFields: true },
} as const;

const isOk = isVariantOfType(variantMap)('ok', {
  value: (x: unknown): x is number => typeof x === 'number',
  meta: (x: unknown): x is { source: string } =>
    typeof x === 'object' &&
    x !== null &&
    'source' in x &&
    typeof (x as { source?: unknown }).source === 'string',
});

const values: unknown[] = [
  { type: 'ok', value: 42, meta: { source: 'api' } },
  { type: 'ok', value: 'oops', meta: { source: 'api' } },
  { type: 'err', code: 500, message: 'fail' },
];

const filtered = values.filter(isOk);
// filtered: Array<{ type: 'ok'; value: unknown; meta: unknown }>

for (const r of filtered) {
  console.log('value:', r.value);
  console.log('meta:', r.meta);
}


