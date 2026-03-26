import { unwrapOrElse, type Task } from '@resultsafe/core-fp-task';

// 3️⃣ Игры — загрузка статистики игрока с fallback

const getPlayerStats: Task<{ level: number; xp: number }> = () =>
  Promise.reject(new Error('Server unreachable'));

const stats = await unwrapOrElse(getPlayerStats, () => ({ level: 1, xp: 0 }));
console.log('Player stats:', stats);
// Player stats: { level: 1, xp: 0 }


