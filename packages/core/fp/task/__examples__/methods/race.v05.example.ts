import { race, type Task } from '@resultsafe/core-fp-task';

// 5️⃣ Образование / Онлайн-тестирование: первый студент завершил задание

const student1: Task<string> = () =>
  new Promise((res) => setTimeout(() => res('Alice finished'), 500));
const student2: Task<string> = () =>
  new Promise((res) => setTimeout(() => res('Bob finished'), 300));

const firstFinish = race(student1, student2);

firstFinish().then(console.log); // кто первый закончил


