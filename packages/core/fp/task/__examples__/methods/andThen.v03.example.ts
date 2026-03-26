// @resultsafe/core-fp-task/src/methods/__examples__/andThen-users.example.ts
import { andThen, type Task } from '@resultsafe/core-fp-task';

type User = { id: number; name: string };
type Posts = { id: number; title: string }[];

// -----------------------------
// 1️⃣ Исходные задачи
// -----------------------------
const fetchUser: Task<User> = () =>
  new Promise((res) => setTimeout(() => res({ id: 1, name: 'Alice' }), 10));

const fetchPostsByUser: (user: User) => Task<Posts> = (user) => () =>
  new Promise((res) =>
    setTimeout(() => res([{ id: 1, title: `${user.name}'s first post` }]), 10),
  );

// -----------------------------
// 2️⃣ Цепочка через andThen
// -----------------------------
const userPosts: Task<Posts> = andThen(fetchUser, fetchPostsByUser);

// -----------------------------
// 3️⃣ Выполнение
// -----------------------------
async function runExample() {
  const posts = await userPosts();
  console.log('Posts by user:', posts);
  // [{ id: 1, title: "Alice's first post" }]
}

runExample();


