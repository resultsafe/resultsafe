import { unwrapOrElse, type Task } from '@resultsafe/core-fp-task';

// 2️⃣ Финансы — курс валют с fallback

const fetchUSDToEUR: Task<number> = () => Promise.reject('API down');

const rate = await unwrapOrElse(fetchUSDToEUR, () => 1);
console.log('USD→EUR rate:', rate);
// USD→EUR rate: 1


