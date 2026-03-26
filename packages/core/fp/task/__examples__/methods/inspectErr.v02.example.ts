import { inspectErr, type Task } from '@resultsafe/core-fp-task';

// 2️⃣ Социальная сеть — посты

type PostStats = { postId: number; likes: number };

const fetchPostStats: Task<PostStats> = () =>
  new Promise((res, rej) =>
    setTimeout(
      () =>
        Math.random() > 0.5
          ? res({ postId: 101, likes: 42 })
          : rej(new Error('Stats API failed')),
      15,
    ),
  );

const loggedFetchPosts = inspectErr(fetchPostStats, (err) => {
  console.warn('📝 Post stats fetch error:', err);
});

async function runPostsExample() {
  try {
    const stats = await loggedFetchPosts();
    console.log('✅ Post stats:', stats);
  } catch {
    console.log('⚠️ Default stats or fallback logic can be applied');
  }
}

runPostsExample();


