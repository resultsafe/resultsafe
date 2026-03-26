import { map, type Task } from '@resultsafe/core-fp-task';

// 3️⃣ Пользовательские данные — приветствие

type User = { id: number; name: string };

const fetchUser: Task<User> = () => Promise.resolve({ id: 1, name: 'Alice' });

// Преобразуем в приветственное сообщение
const greeting: Task<string> = map(fetchUser, (user) => `Hello, ${user.name}!`);

async function runUserExample() {
  const msg = await greeting();
  console.log('👋', msg);
}

runUserExample();


