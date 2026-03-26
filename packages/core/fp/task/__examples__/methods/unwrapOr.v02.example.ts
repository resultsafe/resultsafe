import { unwrapOr, type Task } from '@resultsafe/core-fp-task';

// 2️⃣ Финансы — курс валют

const fetchUSDToEUR: Task<number> = () => Promise.reject('API unavailable');

const rate = await unwrapOr(fetchUSDToEUR, 1); // fallback = 1
console.log('USD→EUR rate:', rate);
// USD→EUR rate: 1


