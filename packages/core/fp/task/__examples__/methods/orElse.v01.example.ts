import { orElse, type Task } from '@resultsafe/core-fp-task';

// 1️⃣ Финансы — получение курса валют с fallback

type ExchangeRate = { from: string; to: string; rate: number };

const fetchUSDToEUR: Task<ExchangeRate> = () =>
  Math.random() > 0.5
    ? Promise.resolve({ from: 'USD', to: 'EUR', rate: 0.93 })
    : Promise.reject(new Error('Primary API failed'));

const fallbackRate: Task<ExchangeRate> = () =>
  Promise.resolve({ from: 'USD', to: 'EUR', rate: 0.95 });

const rateTask: Task<ExchangeRate> = orElse(fetchUSDToEUR, () => fallbackRate);

rateTask().then(console.log);
// Выведет основной курс, если удачно, иначе fallback


