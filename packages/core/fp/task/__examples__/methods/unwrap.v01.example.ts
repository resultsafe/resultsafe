import { unwrap, type Task } from '@resultsafe/core-fp-task';

// 1️⃣ Веб - разработка — получение данных пользователя

const fetchUser: Task<{ id: number; name: string }> = () =>
  Promise.resolve({ id: 1, name: 'Alice' });

const user = await unwrap(fetchUser);
console.log(user);
// { id: 1, name: 'Alice' }


