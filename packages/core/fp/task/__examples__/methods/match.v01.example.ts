import { match, type Task } from '@resultsafe/core-fp-task';

// 1️⃣ Финансы — проверка курса валют

type ExchangeRate = { from: string; to: string; rate: number };

const fetchUSDToEUR: Task<ExchangeRate> = () =>
  Math.random() > 0.5
    ? Promise.resolve({ from: 'USD', to: 'EUR', rate: 0.93 })
    : Promise.reject(new Error('Exchange API failed'));

const resultTask: Task<string> = match(fetchUSDToEUR, {
  Ok: (rate) => `1 ${rate.from} = ${rate.rate} ${rate.to}`,
  Err: (err) => `Error fetching rate: ${(err as Error).message}`,
});

resultTask().then(console.log);


