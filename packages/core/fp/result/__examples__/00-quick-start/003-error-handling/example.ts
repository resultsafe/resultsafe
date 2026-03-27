/**
 * @module 003-error-handling
 * @title Error Handling without Exceptions
 * @description Learn explicit error handling with Result instead of try/catch. Covers error propagation, custom error types, and type-safe error handling patterns.
 * @example
 * import { Ok, Err, match } from '@resultsafe/core-fp-result';
 * const divide = (a, b) => b === 0 ? Err('Division by zero') : Ok(a / b);
 * match(divide(10, 0), v => console.log(v), e => console.error(e));
 * @example
 * import { Ok, Err } from '@resultsafe/core-fp-result';
 * type ApiError = { type: 'network'; message: string } | { type: 'validation'; field: string };
 * const fetchUser = (id) => id.startsWith('user-') ? Ok({ id }) : Err({ type: 'validation', field: 'id' });
 * @tags error-handling,explicit,propagation,custom-types,beginner
 * @since 0.1.0
 * @lastModified 2026-03-27T14:30:00Z
 * @difficulty Beginner
 * @time 5min
 * @category quick-start
 * @see {@link 002-basic-usage} @see {@link 004-chaining} @see {@link ../02-patterns/04-error-handling/001-error-recovery}
 * @ai {"purpose":"Teach explicit error handling without exceptions","prerequisites":["Result type","TypeScript unions"],"objectives":["Error propagation","Custom error types"],"rag":{"queries":["Result error handling example","no try catch pattern"],"intents":["learning","practical"],"expectedAnswer":"Use Result for explicit error handling without try/catch","confidence":0.95},"embedding":{"semanticKeywords":["error-handling","explicit","propagation","custom-types","result"],"conceptualTags":["functional-error","type-safety"],"useCases":["api-errors","validation"]},"codeSearch":{"patterns":["Err({ type:","if (result.ok === false)"],"imports":["import { Ok, Err, match } from '@resultsafe/core-fp-result'"]},"learningPath":{"progression":["002-basic-usage","004-chaining"]},"chunking":{"type":"self-contained","section":"quick-start","subsection":"error-handling","tokenCount":350,"relatedChunks":["002-basic-usage","004-chaining"]}}
 */

import { Err, match, Ok } from '@resultsafe/core-fp-result';

// A function that can fail - returns Result instead of throwing
const divide = (a: number, b: number) =>
  b === 0 ? Err('Division by zero') : Ok(a / b);

// Example 1: Successful division
const result1 = divide(10, 2);
console.log(
  '10 / 2 =',
  match(
    result1,
    (value) => value,
    (error) => `Error: ${error}`,
  ),
); // 5

// Example 2: Division by zero
const result2 = divide(10, 0);
console.log(
  '10 / 0 =',
  match(
    result2,
    (value) => value,
    (error) => `Error: ${error}`,
  ),
); // "Error: Division by zero"

// Example 3: Multiple operations with explicit errors
const safeSqrt = (n: number) =>
  n < 0
    ? Err('Cannot compute square root of negative number')
    : Ok(Math.sqrt(n));

const compute = (a: number, b: number, c: number) => {
  // First operation: division
  const divResult = divide(a, b);
  if (divResult.ok === false) {
    return divResult; // Propagate error
  }

  // Second operation: square root
  return safeSqrt(divResult.value);
};

console.log('√(100 / 4) =', compute(100, 4, 1)); // Ok(5)
console.log('√(100 / 0) =', compute(100, 0, 1)); // Err("Division by zero")
console.log('√(-100 / 4) =', compute(-100, 4, 1)); // Err("Cannot compute square root...")

// Example 4: Custom error types
type ApiError =
  | { type: 'network'; message: string }
  | { type: 'validation'; field: string; message: string }
  | { type: 'server'; code: number };

const fetchUser = (
  id: string,
): Result<{ id: string; name: string }, ApiError> => {
  if (!id.startsWith('user-')) {
    return Err({
      type: 'validation',
      field: 'id',
      message: 'Invalid user ID format',
    });
  }
  return Ok({ id, name: 'John Doe' });
};

const userResult = fetchUser('invalid-id');
console.log(userResult); // Err({ type: 'validation', ... })
