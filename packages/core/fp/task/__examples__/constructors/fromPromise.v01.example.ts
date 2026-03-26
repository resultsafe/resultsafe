import { fromPromise, type Task } from '@resultsafe/core-fp-task';

// 1️⃣ HTTP-запрос (Web/Backend)

const fetchUser: Task<{ id: number; name: string }> = fromPromise(
  fetch('https://jsonplaceholder.typicode.com/users/1').then((res) =>
    res.json(),
  ),
);

fetchUser().then((user) => console.log('Fetched user:', user));


