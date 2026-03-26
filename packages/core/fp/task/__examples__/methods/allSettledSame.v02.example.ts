// @resultsafe/core-fp-task/src/methods/__examples__/allSettledSame-api-result.example.ts
import type { Result } from '@resultsafe/core-fp-result';
import { allSettledSame } from '@resultsafe/core-fp-task';

type Task<T> = () => Promise<T>;

// -----------------------------
// Массив однотипных API-запросов (симуляция)
// -----------------------------
const fetchUserCount: Task<number> = () =>
  new Promise((res) => setTimeout(() => res(120), 20));

const fetchPostCount: Task<number> = () =>
  new Promise((res, rej) =>
    setTimeout(
      () =>
        Math.random() > 0.5 ? res(45) : rej(new Error('Posts API failed')),
      15,
    ),
  );

const fetchCommentCount: Task<number> = () =>
  new Promise((res) => setTimeout(() => res(300), 10));

const tasks: Task<number>[] = [
  fetchUserCount,
  fetchPostCount,
  fetchCommentCount,
];

// -----------------------------
// Выполняем все задачи через allSettledSame с Result из библиотеки
// -----------------------------
const resultsTask: Task<Result<number, unknown>[]> = allSettledSame(tasks);

async function runExample() {
  const results = await resultsTask();

  // Логируем успехи и ошибки
  results.forEach((r, index) => {
    if (r.ok) console.log(`Task ${index + 1} succeeded with value:`, r.value);
    else console.warn(`Task ${index + 1} failed with error:`, r.error);
  });

  // Безопасный агрегированный результат с fallback
  const totalCount = results.reduce((acc, r) => acc + (r.ok ? r.value : 0), 0);
  console.log('Total count (with fallback for failures):', totalCount);
}

runExample();


