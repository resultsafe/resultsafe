// @resultsafe/core-fp-task/src/methods/__examples__/all-realtime.example.ts
import { all, unwrapOrElse } from '@resultsafe/core-fp-task';

type Task<T> = () => Promise<T>;

// -----------------------------
// Симуляция API-запросов
// -----------------------------
const fetchUser: Task<{ id: number; name: string }> = () =>
  new Promise((res) => setTimeout(() => res({ id: 1, name: 'Alice' }), 30));

const fetchPosts: Task<{ id: number; title: string }[]> = () =>
  new Promise((res, rej) =>
    setTimeout(() => {
      // случайная ошибка для демонстрации fallback
      Math.random() > 0.5
        ? res([{ id: 1, title: 'Hello World' }])
        : rej(new Error('Posts failed'));
    }, 20),
  );

const fetchSettings: Task<{ theme: string }> = () =>
  new Promise((res) => setTimeout(() => res({ theme: 'dark' }), 10));

// -----------------------------
// Используем `all` для параллельного выполнения
// -----------------------------
const combined = all([fetchUser, fetchPosts, fetchSettings] as const);

async function runExample() {
  const [user, posts, settings] = await combined();

  console.log('User:', user); // { id: 1, name: 'Alice' }
  console.log('Posts first title:', posts[0]?.title ?? 'No posts'); // безопасный доступ к массиву
  console.log('Settings theme:', settings.theme); // 'dark'

  // -----------------------------
  // 🔹 Используем unwrapOrElse для безопасного fallback
  // -----------------------------
  const safePosts = await unwrapOrElse(fetchPosts, () => []); // вернёт пустой массив при ошибке
  console.log('Safe posts:', safePosts);
}

// Запуск примера
runExample();


