import type { Task } from '@resultsafe/core-fp-task';

// 4️⃣ Образование — получение оценок студента

const loadStudentScores: Task<number[]> = () =>
  new Promise((resolve) => setTimeout(() => resolve([90, 85, 78]), 50));


