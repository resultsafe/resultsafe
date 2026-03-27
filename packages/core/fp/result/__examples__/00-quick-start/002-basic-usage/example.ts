/**
 * @example Basic Usage
 *
 * Creating Ok/Err values, pattern matching, and type-safe access.
 *
 * @difficulty Beginner
 * @time 5 minutes
 * @category quick-start
 */

import { Err, isOk, match, Ok } from '@resultsafe/core-fp-result';

// ===== 1. Create Result values =====

// Success with a number
const successNum = Ok(42);
console.log(successNum); // { ok: true, value: 42 }

// Success with an object
const successObj = Ok({ id: '1', name: 'John' });
console.log(successObj); // { ok: true, value: { id: '1', name: 'John' } }

// Error with a string
const errorStr = Err('Something went wrong');
console.log(errorStr); // { ok: false, error: 'Something went wrong' }

// Error with an object
const errorObj = Err({ code: 500, message: 'Server error' });
console.log(errorObj); // { ok: false, error: { code: 500, message: 'Server error' } }

// ===== 2. Pattern matching =====

const divide = (a: number, b: number) =>
  b === 0 ? Err('Division by zero') : Ok(a / b);

const result = divide(10, 2);

const message = match(
  result,
  (value) => `Result: ${value}`,
  (error) => `Error: ${error}`,
);

console.log(message); // "Result: 5"

// ===== 3. Type-safe access with guards =====

if (isOk(result)) {
  // TypeScript knows result.value exists here
  console.log('Value:', result.value);
}

// ===== 4. Real-world example: User lookup =====

interface User {
  id: string;
  name: string;
  email: string;
}

const users: Record<string, User> = {
  '1': { id: '1', name: 'John', email: 'john@example.com' },
  '2': { id: '2', name: 'Jane', email: 'jane@example.com' },
};

const findUser = (id: string) =>
  users[id] ? Ok(users[id]) : Err(`User ${id} not found`);

const userResult = findUser('1');
const notFoundResult = findUser('999');

match(
  userResult,
  (user) => console.log('Found user:', user.name),
  (error) => console.log('Error:', error),
);
// "Found user: John"

match(
  notFoundResult,
  (user) => console.log('Found user:', user.name),
  (error) => console.log('Error:', error),
);
// "Error: User 999 not found"

// ===== 5. Extract with default =====

import { unwrapOr } from '@resultsafe/core-fp-result';

const port = unwrapOr(findUser('1'), { id: '0', name: 'Anonymous', email: '' });
console.log(port); // { id: '1', name: 'John', email: 'john@example.com' }

const defaultUser = unwrapOr(findUser('999'), {
  id: '0',
  name: 'Anonymous',
  email: '',
});
console.log(defaultUser); // { id: '0', name: 'Anonymous', email: '' }
