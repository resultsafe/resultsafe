import { race, type Task } from '@resultsafe/core-fp-task';

// 3️⃣ IoT / Сенсор с выбором первого сигнала

const sensorA: Task<number> = () =>
  new Promise((res) => setTimeout(() => res(42), 50));
const sensorB: Task<number> = () =>
  new Promise((res) => setTimeout(() => res(43), 30));

const firstReading = race(sensorA, sensorB);

firstReading().then((value) => console.log('First sensor value:', value));


