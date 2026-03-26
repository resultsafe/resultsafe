import { inspectErr, type Task } from '@resultsafe/core-fp-task';

// 1️⃣ Финансы — запрос курсов валют

type ExchangeRate = { from: string; to: string; rate: number };

const fetchUSDToEUR: Task<ExchangeRate> = () =>
  new Promise((res, rej) =>
    setTimeout(
      () =>
        Math.random() > 0.5
          ? res({ from: 'USD', to: 'EUR', rate: 0.93 })
          : rej(new Error('EUR API failed')),
      10,
    ),
  );

const loggedFetchUSDToEUR = inspectErr(fetchUSDToEUR, (err) => {
  if (err instanceof Error)
    console.error('💸 Exchange rate error:', err.message);
});

async function runFinanceExample() {
  try {
    const rate = await loggedFetchUSDToEUR();
    console.log('✅ Fetched rate:', rate);
  } catch {
    console.log('⚠️ Fallback or retry logic can go here');
  }
}

runFinanceExample();


