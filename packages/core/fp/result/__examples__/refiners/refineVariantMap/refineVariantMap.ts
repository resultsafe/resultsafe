// examples/refine-variant-map-example.ts
import { refineVariantMap } from '@resultsafe/core-fp-result';

const variantMap = {
  ok: {
    payload: ['value', 'meta'],
    forbidden: 'error',
    strictFields: true,
  },
  err: {
    payload: ['code', 'message'],
    forbidden: 'value',
    strictFields: true,
  },
} as const;

const validators: any = {
  ok: {
    value: (x: unknown) => typeof x === 'number',
    meta: (x: unknown) =>
      typeof x === 'object' &&
      x !== null &&
      'source' in x &&
      typeof (x as any).source === 'string',
  },
  err: {
    code: (x: unknown) => typeof x === 'number',
    message: (x: unknown) => typeof x === 'string',
  },
};

const values: unknown[] = [
  { type: 'ok', value: 123, meta: { source: 'api' } },
  { type: 'err', code: 500, message: 'fail' },
  { type: 'ok', value: 'oops', meta: { source: 'api' } },
  { type: 'err', code: 'bad', message: 404 },
];

const refined: any[] = values
  .map((v) => refineVariantMap(v, variantMap, validators))
  .filter((v): v is any => v !== null);

for (const r of refined) {
  switch ((r as any).type) {
    case 'ok':
      console.log(`✅ ok: ${(r as any).value} from ${(r as any).meta.source}`);
      break;
    case 'err':
      console.log(`❌ err ${(r as any).code}: ${(r as any).message}`);
      break;
  }
}


