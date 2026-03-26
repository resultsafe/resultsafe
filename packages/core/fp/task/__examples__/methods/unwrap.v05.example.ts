import { unwrap, type Task } from '@resultsafe/core-fp-task';

// 5️⃣ IT/DevOps — проверка статуса сервиса

const checkServiceStatus: Task<boolean> = () => Promise.resolve(true);

const status = await unwrap(checkServiceStatus);
console.log('Service running:', status);
// Service running: true


