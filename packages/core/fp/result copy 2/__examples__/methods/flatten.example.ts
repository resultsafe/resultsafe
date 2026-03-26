import { Err, Ok, flatten } from '@resultsafe/core-fp-result';

console.log(flatten(Ok(Ok(10))));
console.log(flatten(Ok(Err('inner'))));
console.log(flatten(Err('outer')));


