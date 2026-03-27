import { Ok, inspect } from '@resultsafe/core-fp-result';

const result = inspect(Ok({ id: 'u-1' }), (value) => {
  console.log('observed id:', value.id);
});

console.log(result);


