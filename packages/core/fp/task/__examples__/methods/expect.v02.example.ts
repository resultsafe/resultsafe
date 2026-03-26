import { expect, type Task } from '@resultsafe/core-fp-task';

// 1️⃣ Финансы — курсы валют

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

async function runFinanceExample() {
  try {
    const rate = await expect(fetchUSDToEUR, 'Failed to fetch USD to EUR rate');
    console.log(
      `✅ Exchange rate fetched: 1 ${rate.from} = ${rate.rate} ${rate.to}`,
    );
  } catch (err) {
    if (err instanceof Error)
      console.error('❌ Error fetching exchange rate:', err.message);
  }
}

runFinanceExample();


