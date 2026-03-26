// example-createResult.ts

import { isResult } from '@resultsafe/core-fp-union';

const variantMap = {
  ok: { payload: 'value', forbidden: 'error' },
  err: { payload: 'error', forbidden: 'value' },
} as const;

const isResultFromMap = isResult(variantMap);

const values: unknown[] = [
  { type: 'ok', value: 123 },
  { type: 'err', error: 'fail' },
  { type: 'ok', error: 'should not be here' },
  { type: 'err', value: 'unexpected' },
  { type: 'ok', value: 'not a number' },
];

const valid = values.filter(isResultFromMap);

console.log('✅ Валидные результаты:');
for (const result of valid) {
  if (result === undefined) continue;
  console.log(`→ type: ${result.type}`);

  if ('value' in result) {
    console.log(`   value: ${result['value']}`);
  }

  if ('error' in result) {
    console.log(`   error: ${result['error']}`);
  }
}


