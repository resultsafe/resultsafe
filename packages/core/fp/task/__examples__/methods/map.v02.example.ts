import { map, type Task } from '@resultsafe/core-fp-task';

// 2️⃣ Социальные сети — подсчёт лайков

type PostStats = { postId: number; likes: number };

const fetchPostStats: Task<PostStats> = () =>
  Promise.resolve({ postId: 101, likes: 42 });

// Преобразуем в сообщение для пользователя
const likesMessage: Task<string> = map(
  fetchPostStats,
  (stats) => `Post #${stats.postId} has ${stats.likes} likes`,
);

async function runPostsExample() {
  const msg = await likesMessage();
  console.log('📝', msg);
}

runPostsExample();


