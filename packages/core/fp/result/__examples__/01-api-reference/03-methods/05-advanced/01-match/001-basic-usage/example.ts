import { Err, Ok, match } from '@resultsafe/core-fp-result';

const a = match(Ok(5), (v) => `ok:${v}`, (e) => `err:${e}`);
const b = match(Err('boom'), (v) => `ok:${v}`, (e) => `err:${e}`);

console.log(a);
console.log(b);


