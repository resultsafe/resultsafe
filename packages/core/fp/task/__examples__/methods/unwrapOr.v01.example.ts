import { unwrapOr, type Task } from '@resultsafe/core-fp-task';

// 1️⃣ Веб-запросы — получение данных API

const fetchUser: Task<{ id: number; name: string }> = () =>
  Promise.reject('API failed');

const user = await unwrapOr(fetchUser, { id: 0, name: 'Guest' });
console.log(user);
// { id: 0, name: 'Guest' }


