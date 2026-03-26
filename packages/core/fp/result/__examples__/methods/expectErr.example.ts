import { Err, expectErr } from '@resultsafe/core-fp-result';

const error = expectErr(Err('fatal'), 'must be err');
console.log(error);


