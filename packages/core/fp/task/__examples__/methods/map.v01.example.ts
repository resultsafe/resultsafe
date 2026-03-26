import { map, type Task } from '@resultsafe/core-fp-task';

// 1️⃣ Финансы — конвертация валют

type ExchangeRate = { from: string; to: string; rate: number };

const fetchUSDToEUR: Task<ExchangeRate> = () =>
  Promise.resolve({ from: 'USD', to: 'EUR', rate: 0.93 });

// Преобразуем результат в строку для логирования
const formattedRate: Task<string> = map(
  fetchUSDToEUR,
  (rate) => `1 ${rate.from} = ${rate.rate} ${rate.to}`,
);

async function runFinanceExample() {
  const result = await formattedRate();
  console.log('💸 Exchange Rate:', result);
}

runFinanceExample();


