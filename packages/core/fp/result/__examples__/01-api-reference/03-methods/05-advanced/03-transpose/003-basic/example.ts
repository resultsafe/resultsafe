import { Err, Ok, transpose } from '@resultsafe/core-fp-result';

console.log(transpose(Ok({ some: true, value: 5 })));
console.log(transpose(Ok({ some: false })));
console.log(transpose(Err('boom')));


