import { Ok, map, isOk } from '@resultsafe/core-fp-result';

const mapped = map(Ok(1), (x) => x + 1);

if (!isOk(mapped)) {
  throw new Error('unexpected Err');
}

const value: number = mapped.value;
console.log(value);