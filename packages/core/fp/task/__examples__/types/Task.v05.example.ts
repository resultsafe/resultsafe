import type { Task } from '@resultsafe/core-fp-task';

// 5️⃣ IT/DevOps — проверка статуса сервиса

const checkServiceStatus: Task<boolean> = () =>
  fetch('https://example.com/health').then((res) => res.ok);

async function runStatusCheck() {
  const status = await checkServiceStatus();
  console.log('Service is healthy:', status);
}

runStatusCheck();


