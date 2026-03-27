/**
 * @example Error Handling
 * 
 * Demonstrates explicit error handling without try/catch blocks.
 */

import { Ok, Err, match } from '@resultsafe/core-fp-result';

// A function that can fail - returns Result instead of throwing
const divide = (a: number, b: number) =>
  b === 0 
    ? Err('Division by zero') 
    : Ok(a / b);

// Example 1: Successful division
const result1 = divide(10, 2);
console.log('10 / 2 =', match(
  result1,
  (value) => value,
  (error) => `Error: ${error}`
)); // 5

// Example 2: Division by zero
const result2 = divide(10, 0);
console.log('10 / 0 =', match(
  result2,
  (value) => value,
  (error) => `Error: ${error}`
)); // "Error: Division by zero"

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

const fetchUser = (id: string): Result<{ id: string; name: string }, ApiError> => {
  if (!id.startsWith('user-')) {
    return Err({ type: 'validation', field: 'id', message: 'Invalid user ID format' });
  }
  return Ok({ id, name: 'John Doe' });
};

const userResult = fetchUser('invalid-id');
console.log(userResult); // Err({ type: 'validation', ... })
