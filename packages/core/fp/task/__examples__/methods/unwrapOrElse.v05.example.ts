import { unwrapOrElse, type Task } from '@resultsafe/core-fp-task';

// 5️⃣ IT/DevOps — проверка статуса сервиса с fallback

const checkServiceStatus: Task<boolean> = () => Promise.reject('Timeout');

const status = await unwrapOrElse(checkServiceStatus, () => false);
console.log('Service running:', status);
// Service running: false


