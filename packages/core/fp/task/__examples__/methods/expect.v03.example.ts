import { expect, type Task } from '@resultsafe/core-fp-task';

// 2️⃣ Посты на платформе — количество лайков

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

async function runPostsExample() {
  try {
    const stats = await expect(
      fetchPostStats,
      'Failed to fetch post statistics',
    );
    console.log(`✅ Post ${stats.postId} has ${stats.likes} likes`);
  } catch (err) {
    if (err instanceof Error)
      console.error('❌ Error fetching post stats:', err.message);
  }
}

runPostsExample();


