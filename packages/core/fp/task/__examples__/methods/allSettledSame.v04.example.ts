// @resultsafe/core-fp-task/src/methods/__examples__/allSettledSame-finance.example.ts
import type { Result } from '@resultsafe/core-fp-result';
import { allSettledSame } from '@resultsafe/core-fp-task';

type Task<T> = () => Promise<T>;

// -----------------------------
// Имитация API-запросов курсов валют
// -----------------------------
const fetchUSDToEUR: Task<number> = () =>
  new Promise((res) => setTimeout(() => res(0.93), 15));

const fetchUSDToGBP: Task<number> = () =>
  new Promise((res, rej) =>
    setTimeout(
      () =>
        Math.random() > 0.5 ? res(0.81) : rej(new Error('GBP API failed')),
      10,
    ),
  );

const fetchUSDToJPY: Task<number> = () =>
  new Promise((res) => setTimeout(() => res(145.7), 20));

const tasks: Task<number>[] = [fetchUSDToEUR, fetchUSDToGBP, fetchUSDToJPY];

// -----------------------------
// Выполнение через allSettledSame с типом Result
// -----------------------------
const resultsTask: Task<Result<number, unknown>[]> = allSettledSame(tasks);

async function runExample() {
  const results: Result<number, unknown>[] = await resultsTask();

  // Логируем каждый результат
  results.forEach((r, idx) => {
    if (r.ok) console.log(`Task ${idx + 1} succeeded:`, r.value);
    else console.warn(`Task ${idx + 1} failed:`, r.error);
  });

  // Агрегируем успешные курсы
  const successfulRates: number[] = results
    .filter((r): r is { ok: true; value: number } => r.ok)
    .map((r) => r.value);

  console.log('Successful exchange rates:', successfulRates);

  // Безопасный fallback: если какая-то задача упала, используем среднее значение 1
  const safeRates: number[] = results.map((r) => (r.ok ? r.value : 1));
  console.log('All rates with fallback:', safeRates);

  // Средний курс всех доступных API
  const avgRate = safeRates.reduce((sum, r) => sum + r, 0) / safeRates.length;
  console.log('Average rate (with fallback):', avgRate);
}

runExample();


