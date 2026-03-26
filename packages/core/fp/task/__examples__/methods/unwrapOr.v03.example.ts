import { unwrapOr, type Task } from '@resultsafe/core-fp-task';

// 3️⃣ Игры — получение уровня игрока

const getPlayerLevel: Task<number> = () => Promise.reject('Player not found');

const level = await unwrapOr(getPlayerLevel, 1); // default = 1
console.log('Player level:', level);
// Player level: 1


