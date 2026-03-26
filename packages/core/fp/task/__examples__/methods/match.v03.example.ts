import { match, type Task } from '@resultsafe/core-fp-task';

// 3️⃣ Пользовательские данные — безопасное приветствие

type User = { id: number; name: string };

const fetchUser: Task<User> = () =>
  Math.random() > 0.5
    ? Promise.resolve({ id: 1, name: 'Alice' })
    : Promise.reject(new Error('User not found'));

const greetingTask: Task<string> = match(fetchUser, {
  Ok: (user) => `Hello, ${user.name}!`,
  Err: () => 'Hello, Guest!',
});

greetingTask().then(console.log);


