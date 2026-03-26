// @resultsafe/core-fp-task/src/methods/__examples__/andThen-chaining.example.ts
import { andThen, type Task } from '@resultsafe/core-fp-task';

// -----------------------------
// 1️⃣ Простейшие задачи
// -----------------------------
const fetchUserId: Task<number> = () =>
  new Promise((res) => setTimeout(() => res(42), 10));

const fetchUserProfile: (id: number) => Task<{ id: number; name: string }> =
  (id) => () =>
    new Promise((res) => setTimeout(() => res({ id, name: 'Alice' }), 15));

// -----------------------------
// 2️⃣ Цепочка через andThen
// -----------------------------
const userProfileTask: Task<{ id: number; name: string }> = andThen(
  fetchUserId,
  fetchUserProfile,
);

// -----------------------------
// 3️⃣ Выполнение
// -----------------------------
async function runExample() {
  const profile = await userProfileTask();
  console.log('User profile:', profile); // { id: 42, name: 'Alice' }
}

runExample();


