import type { RefinedVariant } from '@resultsafe/core-fp-union';
import {
  isVariantAnd,
  isVariantOfType,
} from '@resultsafe/core-fp-union';

const variantMap = {
  ok: { payload: ['value', 'meta'], forbidden: 'error', strictFields: true },
  err: { payload: ['code', 'message'], forbidden: 'value', strictFields: true },
} as const;

const isOk = isVariantOfType(variantMap)('ok');
const isOkWithValidators = isVariantOfType(variantMap)('ok', {
  value: (x: unknown): x is number => typeof x === 'number',
});
const isOkStrict = isVariantAnd(variantMap)(
  'ok',
  (
    v,
  ): v is RefinedVariant<typeof variantMap, 'ok'> & {
    meta: { source: string };
  } =>
    typeof v.meta === 'object' &&
    v.meta !== null &&
    'source' in v.meta &&
    typeof (v.meta as any).source === 'string',
  {
    meta: (x: unknown): x is { source: string } =>
      typeof x === 'object' &&
      x !== null &&
      'source' in x &&
      typeof (x as { source?: unknown }).source === 'string',
  },
);


