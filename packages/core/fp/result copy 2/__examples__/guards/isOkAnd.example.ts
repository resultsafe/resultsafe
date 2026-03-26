import { Ok, isOkAnd } from '@resultsafe/core-fp-result';

const result = Ok({ id: 'u-1', active: true });

const isActiveUser = isOkAnd(
  result,
  (value) => value.active === true && value.id.length > 0,
);

console.log('is active user:', isActiveUser);


