import { err, Ok } from '@resultsafe/core-fp-result';
import type { TaskResult } from '@resultsafe/core-fp-task-result';
import { taskMatch, unwrapOrElse } from '@resultsafe/core-fp-task-result';

// TaskResult for fetching a user
const fetchUser =
  (id: string): TaskResult<{ name: string }, string> =>
  async () => {
    try {
      const res = await fetch(`https://api.example.com/users/${id}`);
      if (!res.ok) return err('Network error');
      const data = await res.json();
      return Ok(data);
    } catch (err) {
      return err('Fetch failed');
    }
  };

// Example usage
const main = async () => {
  const userTask = fetchUser('1');

  // 1️⃣ Using unwrapOrElse (safe, no exceptions thrown)
  const user1 = await unwrapOrElse(userTask, (err) => {
    console.error('Error occurred:', err);
    return { name: 'Default User' }; // default value
  });
  console.log('User (unwrapOrElse):', user1);

  // 2️⃣ Using taskMatch (explicit Ok / Err handling)
  const user2 = await taskMatch(userTask, {
    Ok: (data) => {
      console.log('User fetched successfully:', data);
      return data;
    },
    Err: (err) => {
      console.error('Failed to fetch user:', err);
      return { name: 'Default User' };
    },
  });
  console.log('User (taskMatch):', user2);
};

main();


