import { Ok, tap } from '@resultsafe/core-fp-result';

const result = tap(Ok(10), (value) => {
  console.log('side effect with:', value);
});

console.log(result);


