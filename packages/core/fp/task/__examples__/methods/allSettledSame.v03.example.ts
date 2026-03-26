// @resultsafe/core-fp-task/src/methods/__examples__/allSettledSame-users-result.example.ts
import type { Result } from '@resultsafe/core-fp-result';
import { allSettledSame, type Task } from '@resultsafe/core-fp-task';

// -----------------------------
// Имитация API-запросов
// -----------------------------
const fetchUsersFromServiceA: Task<string[]> = () =>
  new Promise((res) => setTimeout(() => res(['Alice', 'Bob']), 15));

const fetchUsersFromServiceB: Task<string[]> = () =>
  new Promise((res, rej) =>
    setTimeout(
      () =>
        Math.random() > 0.5
          ? res(['Charlie', 'David'])
          : rej(new Error('Service B failed')),
      10,
    ),
  );

const fetchUsersFromServiceC: Task<string[]> = () =>
  new Promise((res) => setTimeout(() => res(['Eve']), 20));

const tasks: Task<string[]>[] = [
  fetchUsersFromServiceA,
  fetchUsersFromServiceB,
  fetchUsersFromServiceC,
];

// -----------------------------
// Выполнение через allSettledSame с Result из библиотеки
// -----------------------------
const resultsTask: Task<Result<string[], unknown>[]> = allSettledSame(tasks);

async function runExample() {
  const results = await resultsTask();

  // Логируем успехи и ошибки
  results.forEach((r, idx) => {
    if (r.ok) console.log(`Task ${idx + 1} succeeded:`, r.value);
    else console.warn(`Task ${idx + 1} failed:`, r.error);
  });

  // Собираем успешные результаты
  const allUsers = results
    .filter((r): r is { ok: true; value: string[] } => r.ok)
    .flatMap((r) => r.value);

  console.log('All users (successful only):', allUsers);

  // Безопасный fallback: если задача упала, добавляем 'Unknown'
  const allUsersSafe = results.flatMap((r) => (r.ok ? r.value : ['Unknown']));
  console.log('All users (with fallback):', allUsersSafe);
}

runExample();


