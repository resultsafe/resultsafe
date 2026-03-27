import { Ok, expect } from '@resultsafe/core-fp-result';

const value = expect(Ok('ready'), 'must be ok');
console.log(value);


