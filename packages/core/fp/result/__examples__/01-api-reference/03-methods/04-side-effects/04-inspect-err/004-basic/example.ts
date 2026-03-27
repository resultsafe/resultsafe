import { Err, inspectErr } from '@resultsafe/core-fp-result';

const result = inspectErr(Err({ code: 'E_AUTH' }), (error) => {
  console.log('observed error:', error.code);
});

console.log(result);


