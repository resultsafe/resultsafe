import type { Task } from '@resultsafe/core-fp-task';

// 3️⃣ Игры — загрузка профиля игрока

const getPlayerProfile: Task<{ level: number; xp: number }> = () =>
  new Promise((resolve) =>
    setTimeout(() => resolve({ level: 5, xp: 1200 }), 100),
  );


