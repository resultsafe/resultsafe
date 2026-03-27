/**
 * @module 002-basic-usage
 * @title Basic Usage - Creating and Matching Results
 * @description Learn to create Ok/Err values, use pattern matching with match, and access values safely with type guards. Complete introduction to Result fundamentals.
 * @example
 * import { Ok, Err, match } from '@resultsafe/core-fp-result';
 * const success = Ok(42);
 * const failure = Err('error');
 * match(success, v => console.log(v), e => console.error(e));
 * @example
 * import { Ok, Err, isOk } from '@resultsafe/core-fp-result';
 * const result = Ok({ id: '1', name: 'John' });
 * if (isOk(result)) { console.log(result.value.name); }
 * @tags result,ok,err,match,pattern-matching,beginner
 * @since 0.1.0
 * @lastModified 2026-03-27T14:30:00Z
 * @difficulty Beginner
 * @time 5min
 * @category quick-start
 * @see {@link 001-hello-world} @see {@link 003-error-handling} @see {@link 004-chaining}
 * @ai {"purpose":"Teach basic Result creation and pattern matching","prerequisites":["TypeScript types"],"objectives":["Ok/Err creation","Pattern matching"],"rag":{"queries":["Result basic usage example","Ok Err match pattern"],"intents":["learning","quick-start"],"expectedAnswer":"Use Ok(value) for success, Err(error) for failure, match for handling","confidence":0.95},"embedding":{"semanticKeywords":["result","ok","err","match","pattern-matching","beginner"],"conceptualTags":["getting-started","fundamentals"],"useCases":["error-handling","validation"]},"codeSearch":{"patterns":["Ok(value)","Err(error)","match(result"],"imports":["import { Err, isOk, match, Ok } from '@resultsafe/core-fp-result'"]},"learningPath":{"progression":["003-error-handling","004-chaining"]},"chunking":{"type":"self-contained","section":"quick-start","subsection":"basic-usage","tokenCount":400,"relatedChunks":["001-hello-world","003-error-handling"]}}
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
