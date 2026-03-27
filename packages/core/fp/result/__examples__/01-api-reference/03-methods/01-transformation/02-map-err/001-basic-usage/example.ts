import { Err, mapErr } from '@resultsafe/core-fp-result';

const source = Err({ code: 'E_IO' });
const normalized = mapErr(source, (error) => `code:${error.code}`);

console.log(normalized);


