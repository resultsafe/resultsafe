import { match, type Task } from '@resultsafe/core-fp-task';

// 2️⃣ Социальные сети — подсчёт лайков с fallback

type PostStats = { postId: number; likes: number };

const fetchPostStats: Task<PostStats> = () =>
  Math.random() > 0.5
    ? Promise.resolve({ postId: 101, likes: 42 })
    : Promise.reject('Post not found');

const messageTask: Task<string> = match(fetchPostStats, {
  Ok: (stats) => `Post #${stats.postId} has ${stats.likes} likes`,
  Err: (err) => `Failed to fetch post stats: ${err}`,
});

messageTask().then(console.log);


