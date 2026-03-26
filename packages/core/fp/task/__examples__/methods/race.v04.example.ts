import { race, type Task } from '@resultsafe/core-fp-task';

// 4️⃣ Финансы / Выбор первой котировки акции

const stockAPI1: Task<number> = () =>
  new Promise((res) => setTimeout(() => res(101.5), 20));
const stockAPI2: Task<number> = () =>
  new Promise((res) => setTimeout(() => res(101.7), 10));

const firstPrice = race(stockAPI1, stockAPI2);

firstPrice().then((price) => console.log('First stock price:', price));


