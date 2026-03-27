import { isTypedVariantOf } from '@resultsafe/core-fp-result';

const isCreatedWithId = isTypedVariantOf<'created', { id: unknown }>('created');

console.log(isCreatedWithId({ type: 'created', id: '1' }));
console.log(isCreatedWithId({ type: 'created' }));


