import { race, type Task } from '@resultsafe/core-fp-task';

// 2️⃣ Игры / Соревнование двух игроков

const player1: Task<string> = () =>
  new Promise((res) =>
    setTimeout(() => res('Player 1 wins'), Math.random() * 1000),
  );
const player2: Task<string> = () =>
  new Promise((res) =>
    setTimeout(() => res('Player 2 wins'), Math.random() * 1000),
  );

const winner = race(player1, player2);

winner().then(console.log); // кто быстрее, тот выиграл


