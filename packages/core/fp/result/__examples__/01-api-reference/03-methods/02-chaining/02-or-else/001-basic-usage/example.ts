import { Err, Ok, orElse } from '@resultsafe/core-fp-result';

const fallback = orElse(Err('network'), () => Ok('cached-value'));

console.log(fallback);


