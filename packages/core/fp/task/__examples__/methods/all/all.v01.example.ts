// @resultsafe/core-fp-task/src/methods/__examples__/all.example.ts
import { all, orElse } from '@resultsafe/core-fp-task';

type Task<T> = () => Promise<T>;

// -----------------------------
// Симуляция асинхронных задач
// -----------------------------

// Пользователь
const fetchUser: Task<{ id: number; name: string }> = () =>
  new Promise((res) => setTimeout(() => res({ id: 1, name: 'Alice' }), 20));

// Посты пользователя
const fetchPosts: Task<{ id: number; title: string }[]> = () =>
  new Promise((res) =>
    setTimeout(
      () =>
        res([
          { id: 1, title: 'Hello World' },
          { id: 2, title: 'FP Rocks' },
        ]),
      10,
    ),
  );

// Настройки приложения
const fetchSettings: Task<{ theme: string }> = () =>
  new Promise((res) => setTimeout(() => res({ theme: 'dark' }), 15));

// -----------------------------
// Используем `all` с кортежем
// -----------------------------
const combined = all([fetchUser, fetchPosts, fetchSettings] as const);

async function runExample() {
  try {
    const [user, posts, settings] = await combined();

    // -----------------------------
    // ✅ Безопасный доступ к данным
    // -----------------------------
    console.log('User:', user); // { id: 1, name: 'Alice' }
    console.log('First post title:', posts[0]!.title); // 'Hello World'
    console.log('Settings theme:', settings.theme); // 'dark'

    // -----------------------------
    // 🔐 Типобезопасность
    // -----------------------------
    user.id; // number
    posts[0]!.id; // number
    settings.theme; // string
  } catch (error) {
    // -----------------------------
    // ❌ Обработка ошибок через fallback
    // -----------------------------
    console.error('Error fetching data, using fallback:', error);

    const [user, posts, settings] = await all([
      orElse(fetchUser, () => () => Promise.resolve({ id: 0, name: 'Guest' })),
      orElse(fetchPosts, () => () => Promise.resolve([])),
      orElse(fetchSettings, () => () => Promise.resolve({ theme: 'light' })),
    ] as const)();

    console.log('Fallback User:', user);
    console.log('Fallback Posts:', posts);
    console.log('Fallback Settings:', settings);
  }
}

// Запуск примера
runExample();


