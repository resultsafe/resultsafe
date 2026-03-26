import { unwrapOrElse, type Task } from '@resultsafe/core-fp-task';

// 4️⃣ Образование — загрузка оценок студента с fallback

const loadStudentScores: Task<number[]> = () => Promise.reject('Network error');

const scores = await unwrapOrElse(loadStudentScores, () => [0, 0, 0]);
console.log('Student scores:', scores);
// Student scores: [0, 0, 0]


