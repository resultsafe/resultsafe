import { unwrap, type Task } from '@resultsafe/core-fp-task';

// 3️⃣ Игры — загрузка статистики игрока

const getPlayerStats: Task<{ level: number; xp: number }> = () =>
  Promise.resolve({ level: 5, xp: 1200 });

const stats = await unwrap(getPlayerStats);
console.log('Player stats:', stats);
// Player stats: { level: 5, xp: 1200 }


