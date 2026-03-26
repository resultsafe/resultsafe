import { fromPromise, type Task } from '@resultsafe/core-fp-task';

// 3️⃣ IoT/Hardware (датчик температуры)

const readTemperature: Task<number> = fromPromise(
  new Promise<number>((res) => setTimeout(() => res(22.5), 10)),
);

readTemperature().then((temp) => console.log('Temperature:', temp, '°C'));


