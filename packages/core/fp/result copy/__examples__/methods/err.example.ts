import { Err, Ok, err } from '@resultsafe/core-fp-result';

console.log(err(Err('x')));
console.log(err(Ok(1)));


