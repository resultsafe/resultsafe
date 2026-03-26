import { Ok } from '@resultsafe/core-fp-result';
import {
  andThen,
  unwrap,
  type TaskResult,
} from '@resultsafe/core-fp-task-result';
import { promises as fs } from 'fs';

// TaskResult for reading the file
const readFileTask =
  (path: string): TaskResult<string, Error> =>
  async () => {
    try {
      const content = await fs.readFile(path, 'utf-8');
      return Ok(content); // Success
    } catch (err) {
      return err(err as Error); // Failure
    }
  };

// TaskResult for parsing JSON
const parseJson =
  (str: string): TaskResult<object, Error> =>
  async () => {
    try {
      return Ok(JSON.parse(str)); // Success
    } catch (err) {
      return err(err as Error); // Failure
    }
  };

// Sequential processing (read file -> parse JSON)
const processFile = async () => {
  const contentTask = readFileTask('./internal/data.json');
  const resultTask = andThen(contentTask, parseJson);

  try {
    const result = await unwrap(resultTask); // get object or throw if Err
    console.log('Parsed JSON:', result);
  } catch (err) {
    console.error('Failed to process file:', err);
  }
};

processFile();


