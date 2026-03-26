// @resultsafe/core-fp-task/src/methods/__examples__/expect.example.ts
import { expect, type Task } from '@resultsafe/core-fp-task';

type User = { id: number; name: string };

// Имитация API-запроса
const fetchUser: Task<User> = () =>
  new Promise((res, rej) =>
    setTimeout(() => {
      Math.random() > 0.5
        ? res({ id: 1, name: 'Alice' })
        : rej(new Error('User fetch failed'));
    }, 15),
  );

async function runExample() {
  try {
    // Используем expect для безопасного "unwrap" с сообщением об ошибке
    const user = await expect(fetchUser, 'Failed to fetch user');
    console.log('✅ Fetched user:', user);
  } catch (err) {
    // Type narrowing для unknown
    if (err instanceof Error) {
      console.error('❌ Error message:', err.message);
    } else {
      console.error('❌ Unknown error:', err);
    }
  }
}

// Можно вызывать несколько раз, демонстрируя надежность
runExample();


