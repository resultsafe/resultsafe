// void.example.ts

import { Err, Ok, type Result } from '@resultsafe/core-fp-result';
import { isVoid, VoidValue, type Void } from '@resultsafe/core-fp-void';

/**
 * [EN] Function that performs an effect and returns Void
 * [RU] Функция, которая выполняет эффект и возвращает Void
 */
const logMessage = (msg: string): Result<Void, string> => {
  try {
    console.log(msg);
    return Ok(VoidValue); // используем новое имя значения
  } catch (error) {
    return Err(`Logging failed: ${(error as Error).message}`);
  }
};

// [EN] Usage
// [RU] Использование
const result = logMessage('Hello, world!');
if (result.ok) {
  if (isVoid(result.value)) {
    console.log('✅ Effect performed successfully');
  }
} else {
  console.error('❌ Error:', result.error);
}


