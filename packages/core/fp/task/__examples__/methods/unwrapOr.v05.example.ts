import { unwrapOr, type Task } from '@resultsafe/core-fp-task';

// 5️⃣ IT / DevOps — проверка статуса сервиса

const checkService: Task<boolean> = () => Promise.reject('Service down');

const status = await unwrapOr(checkService, false); // fallback = false
console.log('Service running:', status);
// Service running: false


