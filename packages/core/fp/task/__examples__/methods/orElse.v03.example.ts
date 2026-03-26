import { orElse, type Task } from '@resultsafe/core-fp-task';

// 3️⃣ Пользователи — получение данных с fallback на гостя

type User = { id: number; name: string };

const fetchUser: Task<User> = () =>
  Math.random() > 0.5
    ? Promise.resolve({ id: 1, name: 'Alice' })
    : Promise.reject(new Error('User API failed'));

const guestUser: Task<User> = () => Promise.resolve({ id: 0, name: 'Guest' });

const userTask: Task<User> = orElse(fetchUser, () => guestUser);

userTask().then(console.log);


