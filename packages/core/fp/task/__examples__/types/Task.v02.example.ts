import type { Task } from '@resultsafe/core-fp-task';

// 2️⃣ Финансы — получение курса валют

const fetchUSDToEUR: Task<number> = () =>
  fetch('https://api.exchangerate.host/latest?base=USD&symbols=EUR')
    .then((res) => res.json())
    .then((data) => data.rates.EUR);


