import { fromPromise, type Task } from '@resultsafe/core-fp-task';

// 4️⃣ Пользовательский ввод (UI)

const getUserInput: Task<string> = fromPromise(
  new Promise<string>((res) =>
    setTimeout(() => res(prompt('Enter your name:') || ''), 0),
  ),
);

getUserInput().then((name) => console.log('User entered:', name));


