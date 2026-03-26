import { orElse, type Task } from '@resultsafe/core-fp-task';

// 2️⃣ Социальные сети — получение числа лайков с запасным значением

type PostStats = { postId: number; likes: number };

const fetchPostStats: Task<PostStats> = () =>
  Math.random() > 0.5
    ? Promise.resolve({ postId: 101, likes: 42 })
    : Promise.reject('Primary service failed');

const fallbackStats: Task<PostStats> = () =>
  Promise.resolve({ postId: 101, likes: 0 });

const statsTask: Task<PostStats> = orElse(fetchPostStats, () => fallbackStats);

statsTask().then(console.log);


