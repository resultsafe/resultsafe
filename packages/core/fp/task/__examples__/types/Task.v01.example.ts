import type { Task } from '@resultsafe/core-fp-task';

// 1️⃣ Веб-разработка — получение данных пользователя

const fetchUser: Task<{ id: number; name: string }> = () =>
  fetch('/api/user').then((res) => res.json());


