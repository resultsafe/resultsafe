import { unwrapOr, type Task } from '@resultsafe/core-fp-task';

// 4️⃣ Образование — загрузка баллов теста

const loadTestScore: Task<number[]> = () => Promise.reject('DB error');

const scores = await unwrapOr(loadTestScore, []); // fallback = empty array
console.log('Test scores:', scores);
// Test scores: []


