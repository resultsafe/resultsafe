import { err, Ok } from '@resultsafe/core-fp-result';
import { all, type TaskResult } from '@resultsafe/core-fp-task-result';

// Array of TaskResults
const tasks: TaskResult<number, string>[] = [
  async () => Ok(10),
  async () => Ok(20),
  async () => err('Failed task'),
];

// Combine all tasks
const combined = all(tasks);

const main = async () => {
  const result = await combined();

  if (result.ok) {
    console.log('All tasks succeeded. Values:', result.value);
  } else {
    console.error('A task failed with error:', result.error);
  }
};

main();


