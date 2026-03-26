import { Ok, unwrap } from '@resultsafe/core-fp-result';

const value = unwrap(Ok(99));
console.log(value);


