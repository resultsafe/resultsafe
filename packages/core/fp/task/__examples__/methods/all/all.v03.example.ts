// @resultsafe/core-fp-task/src/methods/__examples__/all-profile.example.ts
import { all, andThen, map, unwrapOrElse } from '@resultsafe/core-fp-task';

type Task<T> = () => Promise<T>;

const fetchUser: Task<{ id: number; name: string }> = () =>
  new Promise((res) => setTimeout(() => res({ id: 1, name: 'Alice' }), 20));

const fetchPosts: Task<{ id: number; title: string }[]> = () =>
  new Promise((res, rej) =>
    setTimeout(() => {
      Math.random() > 0.3
        ? res([{ id: 1, title: 'Hello World' }])
        : rej(new Error('Posts failed'));
    }, 10),
  );

const fetchSettings: Task<{ theme: string }> = () =>
  new Promise((res) => setTimeout(() => res({ theme: 'dark' }), 15));

// -----------------------------
// 1️⃣ Выполняем все задачи параллельно
// -----------------------------
const combined = all([fetchUser, fetchPosts, fetchSettings] as const);

// -----------------------------
// 2️⃣ Формируем профиль пользователя
// -----------------------------
const userProfile: Task<{ name: string; postTitles: string[]; theme: string }> =
  andThen(combined, ([user, posts, settings]) =>
    map(
      () =>
        Promise.resolve({
          name: user.name,
          postTitles: posts.map((p) => p.title),
          theme: settings.theme,
        }),
      (x) => x,
    ),
  );

// -----------------------------
// 3️⃣ Получаем безопасно с fallback
// -----------------------------
async function runExample() {
  const profile = await unwrapOrElse(userProfile, () => ({
    name: 'Guest',
    postTitles: [],
    theme: 'light',
  }));

  console.log('✅ User Profile:', profile);
  // name: string
  // postTitles: string[]
  // theme: string
}

runExample();


