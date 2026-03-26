import { Err, Ok, unwrapOr } from '@resultsafe/core-fp-result';

console.log(unwrapOr(Ok(7), 0));
console.log(unwrapOr(Err('boom'), 0));


