import { unwrap, type Task } from '@resultsafe/core-fp-task';

// 4️⃣ Образование — загрузка оценок студента

const loadStudentScores: Task<number[]> = () => Promise.resolve([85, 92, 78]);

const scores = await unwrap(loadStudentScores);
console.log('Student scores:', scores);
// Student scores: [85, 92, 78]


