import { race, type Task } from '@resultsafe/core-fp-task';

//1️⃣ Веб-запросы / Fetch с таймаутом

const fetchData: Task<string> = () =>
  fetch('https://api.example.com/data').then((res) => res.text());
const timeout: Task<string> = () =>
  new Promise((res) => setTimeout(() => res('timeout'), 5000));

const fastResponse = race(fetchData, timeout);

fastResponse().then(console.log); // выведет данные или 'timeout'


