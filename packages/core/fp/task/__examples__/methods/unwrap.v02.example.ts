import { unwrap, type Task } from '@resultsafe/core-fp-task';

// 2️⃣ Финансы — получение курса валют

const fetchUSDToEUR: Task<number> = () => Promise.resolve(0.93);

const rate = await unwrap(fetchUSDToEUR);
console.log('USD→EUR rate:', rate);
// USD→EUR rate: 0.93


