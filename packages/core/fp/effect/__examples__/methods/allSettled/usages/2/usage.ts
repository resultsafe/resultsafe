import { err, Ok, type Result } from '@resultsafe/core-fp-result';
import { allSettled, type TaskResult } from '@resultsafe/core-fp-task-result';

// Array of TaskResults
const tasks: TaskResult<number, string>[] = [
  async () => Ok(10),
  async () => err('Failed task 1'),
  async () => Ok(30),
  async () => err('Failed task 2'),
];

// Combine all tasks using allSettled
const combined = allSettled(tasks);

const main = async () => {
  const result: Result<Result<number, string>[], never> = await combined();

  if (result.ok) {
    console.log('All settled results:');
    result.value.forEach((r: Result<number, string>, index: number) => {
      if (r.ok) {
        console.log(`Task ${index + 1}: Success ->`, r.value);
      } else {
        console.error(`Task ${index + 1}: Error ->`, r.error);
      }
    });
  } else {
    // technically won't happen because allSettled never fails
    console.error('Unexpected error:', result.error);
  }
};

main();


