import { isTypedVariant } from '@resultsafe/core-fp-result';

const isCreated = isTypedVariant('created');

console.log(isCreated({ type: 'created', id: '1' }));
console.log(isCreated({ type: 'deleted', id: '1' }));


