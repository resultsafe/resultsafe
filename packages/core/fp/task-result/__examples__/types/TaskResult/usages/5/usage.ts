import { Ok } from '@resultsafe/core-fp-result';
import type { TaskResult } from '@resultsafe/core-fp-task-result';
import { inspect, inspectError } from '@resultsafe/core-fp-task-result';

const logTask: TaskResult<number, string> = async () => Ok(42);

// Inspect the success value
const logged = inspect(logTask, (value) => {
  console.log('Success:', value);
});

// Inspect the error value
const loggedErr = inspectError(logTask, (error) => {
  console.error('Error:', error);
});

(async () => {
  await logged(); // Output: Success: 42
  await loggedErr(); // No output, because the result is Ok
})();


