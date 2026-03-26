import { fromPromise, type Task } from '@resultsafe/core-fp-task';

const fetchUSDToEUR: Task<number> = fromPromise(
  new Promise<number>((res) => setTimeout(() => res(0.93), 20)),
);

fetchUSDToEUR().then((rate) => console.log('USD -> EUR rate:', rate));


