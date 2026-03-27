import { Err, Ok, isOk } from '@resultsafe/core-fp-result';

const a = Ok(42);
const b = Err('boom');

console.log('a is ok:', isOk(a));
console.log('b is ok:', isOk(b));


