import { Err, unwrapErr } from '@resultsafe/core-fp-result';

const error = unwrapErr(Err({ code: 'E_DB' }));
console.log(error.code);


