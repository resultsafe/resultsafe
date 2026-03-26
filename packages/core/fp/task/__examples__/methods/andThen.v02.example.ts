// @resultsafe/core-fp-task/src/methods/__examples__/andThen-finance.example.ts
import { andThen, type Task } from '@resultsafe/core-fp-task';

// -----------------------------
// 1️⃣ Исходные задачи
// -----------------------------
const fetchUSDToEUR: Task<number> = () =>
  new Promise((res) => setTimeout(() => res(0.93), 10));

const convertAmount: (rate: number) => Task<number> = (rate) => () =>
  new Promise((res) => setTimeout(() => res(100 * rate), 5)); // конвертация 100 USD

// -----------------------------
// 2️⃣ Цепочка через andThen
// -----------------------------
const amountInEUR: Task<number> = andThen(fetchUSDToEUR, convertAmount);

// -----------------------------
// 3️⃣ Выполнение
// -----------------------------
async function runExample() {
  const eur = await amountInEUR();
  console.log('100 USD in EUR:', eur); // примерно 93
}

runExample();


