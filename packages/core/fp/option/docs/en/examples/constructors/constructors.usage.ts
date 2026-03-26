import { None, Some } from '@resultsafe/core-fp-option';

const someValue = Some(42);
const noneValue = None;

console.log(someValue); // { some: true, value: 42 }
console.log(noneValue); // { some: false }

// ✅ Типобезопасность
if (someValue.some === true) {
  console.log(someValue.value); // 42
}

if (noneValue.some === false) {
  console.log('No value');
}


