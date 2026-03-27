import { Err, Ok, isErr } from '@resultsafe/core-fp-result';

const a = Ok(42);
const b = Err('boom');

console.log('a is err:', isErr(a));
console.log('b is err:', isErr(b));


