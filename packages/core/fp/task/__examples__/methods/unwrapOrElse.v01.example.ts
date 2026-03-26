import { unwrapOrElse, type Task } from '@resultsafe/core-fp-task';

// 1️⃣ Веб-разработка — получение пользователя с fallback

const fetchUser: Task<{ id: number; name: string }> = () =>
  Promise.reject(new Error('User API failed'));

const user = await unwrapOrElse(fetchUser, () => ({ id: 0, name: 'Guest' }));
console.log(user);
// { id: 0, name: 'Guest' }


