const { Ok, map, unwrapOr } = require('@resultsafe/core-fp-result');
const v = unwrapOr(map(Ok(21), (n) => n * 2), 0);
if (v !== 42) throw new Error('cjs failed');
console.log('cjs-ok');