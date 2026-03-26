import type { RefinedOk } from '@resultsafe/core-fp-union';
import { isOkAnd } from '@resultsafe/core-fp-union';

const variantMap = {
  ok: { payload: ['value', 'meta'], forbidden: 'error', strictFields: true },
} as const;

type Ok = RefinedOk<typeof variantMap>;

const okAndHasNumberValue = isOkAnd(variantMap)(
  (v): v is Ok & { value: number; meta: { source: string } } =>
    typeof v.value === 'number' &&
    typeof v.meta === 'object' &&
    v.meta !== null &&
    'source' in v.meta &&
    typeof (v.meta as { source?: unknown }).source === 'string',
);

const values: unknown[] = [
  { type: 'ok', value: 123, meta: { source: 'api' } },
  { type: 'ok', value: 'oops', meta: { source: 'api' } },
  { type: 'ok', value: 7, meta: { source: 'db' }, extra: true },
];

const filtered = values.filter(okAndHasNumberValue);

for (const r of filtered) {
  console.log('ok value:', r.value);
  console.log('meta.source:', r.meta.source);
}


