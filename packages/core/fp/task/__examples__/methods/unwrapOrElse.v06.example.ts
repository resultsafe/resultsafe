import { unwrapOrElse } from '@resultsafe/core-fp-task';

type Task<T> = () => Promise<T>;

const fetchUser: Task<{ id: number; name: string }> = () =>
  Promise.resolve({ id: 1, name: 'Alice' });

const fetchPosts: Task<{ id: number; title: string }[]> = () =>
  Promise.reject(new Error('Posts failed'));

const fetchSettings: Task<{ theme: string }> = () =>
  Promise.resolve({ theme: 'dark' });

// ✅ Выполняем каждую задачу отдельно с безопасным fallback
async function runExample() {
  const user = await unwrapOrElse(fetchUser, () => ({ id: 0, name: 'Guest' }));
  const posts = await unwrapOrElse(fetchPosts, () => []);
  const settings = await unwrapOrElse(fetchSettings, () => ({
    theme: 'light',
  }));

  console.log('User:', user);
  console.log('Posts:', posts);
  console.log('Settings:', settings);
}

runExample();


