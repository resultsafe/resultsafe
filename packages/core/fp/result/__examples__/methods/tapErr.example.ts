import { Err, tapErr } from '@resultsafe/core-fp-result';

const result = tapErr(Err('fatal'), (error) => {
  console.log('side effect for error:', error);
});

console.log(result);


