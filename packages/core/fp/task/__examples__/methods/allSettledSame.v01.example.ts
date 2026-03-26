// @resultsafe/core-fp-task/src/methods/__examples__/allSettledSame-result.example.ts
import type { Result } from '@resultsafe/core-fp-result';
import { allSettledSame, type Task } from '@resultsafe/core-fp-task';

// -----------------------------
// 1️⃣ Массив однотипных задач
// -----------------------------
const task1: Task<number> = () => Promise.resolve(10);
const task2: Task<number> = () => Promise.resolve(20);
const task3: Task<number> = () =>
  new Promise((_, rej) => setTimeout(() => rej(new Error('fail')), 15));

const tasks: Task<number>[] = [task1, task2, task3];

// -----------------------------
// 2️⃣ Выполняем задачи через allSettledSame с Result из библиотеки
// -----------------------------
const resultsTask: Task<Result<number, unknown>[]> = allSettledSame(tasks);

async function runExample() {
  const results = await resultsTask();

  results.forEach((r, index) => {
    if (r.ok) {
      console.log(`Task ${index + 1} succeeded with value:`, r.value);
    } else {
      console.warn(`Task ${index + 1} failed with error:`, r.error);
    }
  });

  // Пример безопасного fallback
  const safeValues = results.map((r) => (r.ok ? r.value : 0));
  console.log('Safe values array:', safeValues); // [10, 20, 0]

  // Среднее значение всех успешных задач
  const avg = safeValues.reduce((sum, v) => sum + v, 0) / safeValues.length;
  console.log('Average value (with fallback):', avg);
}

runExample();


