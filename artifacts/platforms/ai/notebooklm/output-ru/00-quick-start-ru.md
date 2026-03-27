# 00-quick-start

# Как мне first 30 seconds with result type?

## Краткий ответ
Используйте Err, Ok для обработки.

## Подробное объяснение
first 30 seconds С типом Result. Изучите как create success and error values with Ok and Err constructors.

## Пример кода
```typescript
import { Err, Ok } from '@resultsafe/core-fp-result';

const success = Ok(42);
console.log('Success:', success);

const failure = Err('Something went wrong');
console.log('Failure:', failure);
```

## Когда использовать
При трансформации или связывании операций Result

## Ключевые функции
- `Err`
- `Ok`

## Связанные концепции
- [[Err]]
- [[Ok]]

## Метаданные
- **Теги:** 
- **Сложность:** Средний
- **Модуль:**

---

# Как мне to create ok/err values, use использовать pattern matching with match, and получить значения safely with использовать type guards?

## Краткий ответ
Используйте Err, match, Ok для обработки.

## Подробное объяснение
to create Ok/Err values, use Сопоставление паттернов with match, and Доступ к значениям Безопасно with Защиты типов. Полное введение to Result Основы.

## Пример кода
```typescript
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
```

## Когда использовать
При трансформации или связывании операций Result

## Ключевые функции
- `Err`
- `match`
- `Ok`
- `Result`

## Связанные концепции
- [[Err]]
- [[match]]
- [[Ok]]
- [[Result]]

## Метаданные
- **Теги:** 
- **Сложность:** Средний
- **Модуль:**

---

# Как мне explicit обработать ошибки with result instead of try/catch?

## Краткий ответ
Используйте Err, match, Ok для обработки.

## Подробное объяснение
explicit Обработка ошибок with Result instead of try/catch. Covers error propagation, custom error types, and type-safe Обработка ошибок Паттерны.

## Пример кода
```typescript
import { Err, match, Ok, type Result } from '@resultsafe/core-fp-result';

// A function that can fail - returns Result instead of throwing
const divide = (a: number, b: number) =>
  b === 0 ? Err('Division by zero') : Ok(a / b);

// Example 1: Successful division
const result1 = divide(10, 2);
console.log(
  '10 / 2 =',
  match(
    result1,
    (value) => `${value}`,
    (error) => `Error: ${error}`,
  ),
); // 5

// Example 2: Division by zero
const result2 = divide(10, 0);
console.log(
  '10 / 0 =',
  match(
    result2,
    (value) => `${value}`,
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
```

## Когда использовать
При трансформации или связывании операций Result

## Ключевые функции
- `Err`
- `match`
- `Ok`
- `Result`

## Связанные концепции
- [[Err]]
- [[match]]
- [[Ok]]
- [[Result]]

## Метаданные
- **Теги:** 
- **Сложность:** Средний
- **Модуль:**

---

# Как мне to compose result operations with map, maperr, andthen, and orelse?

## Краткий ответ
Используйте andThen, Err, map, Ok для обработки.

## Подробное объяснение
to compose Result operations with map, mapErr, andThen, and orElse. Functional chaining Паттерны for clean, readable pipelines.

## Пример кода
```typescript
import {
  andThen,
  Err,
  map,
  mapErr,
  Ok,
  orElse,
  type Result,
} from '@resultsafe/core-fp-result';

// ===== map: Transform success value =====

const double = (x: number) => x * 2;
const toString = (x: number) => `Value: ${x}`;

const result1 = Ok(21);
const doubled = map(result1, double);
console.log(doubled); // Ok(42)

const described = map(doubled, toString);
console.log(described); // Ok("Value: 42")

// map on Err passes through unchanged
const errResult = Err('error');
const mappedErr = map(errResult, double);
console.log(mappedErr); // Err('error')

// ===== mapErr: Transform error value =====

const result2 = Ok(42);
const mappedSuccess = mapErr(result2, (e) => `Transformed: ${e}`);
console.log(mappedSuccess); // Ok(42) - unchanged

const errorResult = Err('original');
const transformedErr = mapErr(errorResult, (e) => `Transformed: ${e}`);
console.log(transformedErr); // Err("Transformed: original")

// ===== andThen: Chain operations (flatMap) =====

const parsePort = (raw: string) => {
  const port = Number(raw);
  return Number.isInteger(port) && port > 0 && port <= 65535
    ? Ok(port)
    : Err('invalid-port');
};

const validatePort = (port: number) =>
  port < 1024 ? Err('privileged-port') : Ok(port);

const result3 = andThen(Ok('8080'), parsePort);
console.log(result3); // Ok(8080)

const chained = andThen(result3, validatePort);
console.log(chained); // Ok(8080) - port >= 1024

const invalidChain = andThen(Ok('99999'), parsePort);
console.log(invalidChain); // Err('invalid-port')

// ===== orElse: Recover from errors =====

const fallbackToDefault = (e: string) => Ok(3000); // Default port
const recovered = orElse(Err('invalid-port'), fallbackToDefault);
console.log(recovered); // Ok(3000)

const successNoRecovery = orElse(Ok(8080), fallbackToDefault);
console.log(successNoRecovery); // Ok(8080) - success passes through

// ===== Complex chain =====

const parseAndValidate = (raw: string) => andThen(Ok(raw), parsePort);

const withFallback = (raw: string) =>
  orElse(parseAndValidate(raw), () => Ok(3000));

console.log(withFallback('8080')); // Ok(8080)
console.log(withFallback('invalid')); // Ok(3000) - fallback
console.log(withFallback('99999')); // Ok(3000) - fallback

// ===== Pipe-style composition =====

// Functional pipeline approach
const pipeline = (input: string): Result<number, string> => {
  const step1 = Ok(input);
  const step2 = andThen(step1, parsePort);
  const step3 = andThen(step2, validatePort);
  return orElse(step3, () => Ok(3000));
};

// Note: The functional approach uses nested function calls:
// andThen(Ok(input), parsePort)
// This demonstrates the functional approach vs method chaining
```

## Когда использовать
При трансформации или связывании операций Result

## Ключевые функции
- `andThen`
- `Err`
- `map`
- `Ok`
- `Result`

## Связанные концепции
- [[andThen]]
- [[Err]]
- [[map]]
- [[Ok]]
- [[Result]]

## Метаданные
- **Теги:** 
- **Сложность:** Средний
- **Модуль:**