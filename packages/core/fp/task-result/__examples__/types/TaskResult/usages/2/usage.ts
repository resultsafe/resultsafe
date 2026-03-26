import { Ok } from '@resultsafe/core-fp-result';
import type { TaskResult } from '@resultsafe/core-fp-task-result';
import { promises as fs } from 'fs';

const readFileTask =
  (path: string): TaskResult<string, Error> =>
  async () => {
    try {
      const content = await fs.readFile(path, 'utf-8');
      return Ok(content); // ✅ Success
    } catch (err) {
      return err(err as Error); // ❌ Failure
    }
  };

const main = async () => {
  const fileTask = readFileTask('./internal/data.json');

  const result = await fileTask();

  if (result.ok) {
    console.log('📄 File content:', result.value);
  } else {
    console.error('❌ Failed to read file:', result.error);
  }
};

main();


