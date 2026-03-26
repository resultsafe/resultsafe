import * as readline from 'node:readline/promises';

/**
 * FP-утилита: задать вопрос в консоли и вернуть ответ.
 */
export const ask = async (prompt) => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  try {
    return await rl.question(prompt);
  } finally {
    rl.close();
  }
};
