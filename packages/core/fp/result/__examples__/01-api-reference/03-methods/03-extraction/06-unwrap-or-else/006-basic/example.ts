import { Err, Ok, unwrapOrElse } from '@resultsafe/core-fp-result';

console.log(unwrapOrElse(Ok(7), () => 0));
console.log(unwrapOrElse(Err('boom'), (e) => e.length));


