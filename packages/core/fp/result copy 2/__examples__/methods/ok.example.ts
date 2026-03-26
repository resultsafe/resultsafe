import { Err, Ok, ok } from '@resultsafe/core-fp-result';

console.log(ok(Ok(1)));
console.log(ok(Err('x')));


