import { Err } from '@resultsafe/core-fp-result';

const error = { code: 'E_AUTH', message: 'Token expired' };
const result = Err(error);

console.log('ok:', result.ok);
if (!result.ok) {
  console.log('error.code:', result.error.code);
}


