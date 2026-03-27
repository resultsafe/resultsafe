import { Ok, map } from '@resultsafe/core-fp-result';

const source = Ok(21);
const doubled = map(source, (value) => value * 2);

console.log(doubled);


