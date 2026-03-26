import { Ok } from '@resultsafe/core-fp-result';

const value = { id: 'u-1', role: 'admin' };
const result = Ok(value);

console.log('ok:', result.ok);
if (result.ok) {
  console.log('value.id:', result.value.id);
}


