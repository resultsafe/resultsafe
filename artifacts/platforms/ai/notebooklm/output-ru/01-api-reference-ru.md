# 01-api-reference

# Как мне successful result values with ok constructor for explicit success representation in functional обработать ошибки?

## Краткий ответ
Используйте Ok для обработки.

## Подробное объяснение
successful Result values with Ok constructor for explicit success representation in functional Обработка ошибок.

## Пример кода
```typescript
import { Ok } from '@resultsafe/core-fp-result';

const result = Ok(42);
console.log(result); // { ok: true, value: 42 }
```

## Когда использовать
При трансформации или связывании операций Result

## Ключевые функции
- `Ok`

## Связанные концепции
- [[Ok]]

## Метаданные
- **Теги:** 
- **Сложность:** Средний
- **Модуль:**

---

# Как мне ok with explicit generic type parameters for better type safety?

## Краткий ответ
Используйте Ok для обработки.

## Подробное объяснение
Ok with explicit generic type parameters for better type safety. This example shows how to specify success and error types explicitly.

## Пример кода
```typescript
import { Ok, type Result } from '@resultsafe/core-fp-result';

// ===== Example 1: Explicit type parameters =====
const explicitTypes = () => {
  const numberResult: Result<number, string> = Ok<number, string>(42);
  console.log(numberResult); // { ok: true, value: 42 }

  const stringResult: Result<string, Error> = Ok<string, Error>('success');
  console.log(stringResult); // { ok: true, value: 'success' }
};

// ===== Example 2: Complex types =====
interface User {
  id: string;
  name: string;
}

type ApiError = { code: number; message: string };

const complexTypes = () => {
  const userResult: Result<User, ApiError> = Ok<User, ApiError>({
    id: 'user-1',
    name: 'John',
  });

  if (userResult.ok) {
    console.log('Value:', userResult.value.name); // 'John'
  }
};

// ===== Run if standalone =====
if (require.main === module) {
  explicitTypes();
  complexTypes();
}
```

## Когда использовать
При трансформации или связывании операций Result

## Ключевые функции
- `Ok`
- `Result`

## Связанные концепции
- [[Ok]]
- [[Result]]

## Метаданные
- **Теги:** 
- **Сложность:** Средний
- **Модуль:**

---

# Как мне ok in использовать в продакшне code with api responses, validation, and обработать ошибки?

## Краткий ответ
Используйте Err, Ok для обработки.

## Подробное объяснение
Ok in Продакшн code with API responses, Валидация, and Обработка ошибок. This example Демонстрирует practical usage Паттерны.

## Пример кода
```typescript
import { Err, Ok, type Result } from '@resultsafe/core-fp-result';

// ===== Example 1: API Response Pattern =====
interface User {
  id: string;
  name: string;
  email: string;
}

interface ApiError {
  status: number;
  message: string;
}

type UserResult = Result<User, ApiError>;

const fetchUser = async (id: string): Promise<UserResult> => {
  try {
    const response = await fetch(`/api/users/${id}`);

    if (!response.ok) {
      return Err({
        status: response.status,
        message: response.statusText,
      });
    }

    const data = (await response.json()) as User;
    return Ok(data);
  } catch (error) {
    return Err({
      status: 0,
      message: error instanceof Error ? error.message : 'Network error',
    });
  }
};

// ===== Example 2: Validation Pattern =====
interface ValidationError {
  field: string;
  message: string;
}

const validateEmail = (email: string): Result<string, ValidationError> => {
  if (!email.includes('@')) {
    return Err({ field: 'email', message: 'Invalid email format' });
  }
  return Ok(email);
};

// ===== Example 3: Factory Function =====
const createUser = (name: string, email: string) => {
  const emailResult = validateEmail(email);

  if (emailResult.ok === false) {
    return emailResult;
  }

  return Ok({ id: 'user-1', name, email: emailResult.value });
};

// ===== Run if standalone =====
if (require.main === module) {
  const user = createUser('John', 'john@example.com');
  console.log(user); // Ok({ id: 'user-1', name: 'John', email: 'john@example.com' })
}
```

## Когда использовать
При трансформации или связывании операций Result

## Ключевые функции
- `Err`
- `Ok`
- `Result`

## Связанные концепции
- [[Err]]
- [[Ok]]
- [[Result]]

## Метаданные
- **Теги:** 
- **Сложность:** Средний
- **Модуль:**

---

# Как мне error result values with err constructor?

## Краткий ответ
Используйте Err, Ok для обработки.

## Подробное объяснение
error Result values with Err constructor. This example Демонстрирует how to explicitly represent failures without exceptions.

## Пример кода
```typescript
import { Err, Ok, type Result } from '@resultsafe/core-fp-result';

// ===== Example 1: Basic error value =====
const basicExample = () => {
  const error = Err('Something went wrong');
  console.log(error); // { ok: false, error: 'Something went wrong' }
  console.log(error.ok); // false
  if (error.ok === false) {
    console.log(error.error); // 'Something went wrong'
  }
};

// ===== Example 2: Error in function =====
const divide = (a: number, b: number): Result<number, string> => {
  if (b === 0) {
    return Err('Division by zero');
  }
  return Ok(a / b);
};

const functionExample = () => {
  const result = divide(10, 0);
  console.log(result); // { ok: false, error: 'Division by zero' }
};

// ===== Run if standalone =====
if (require.main === module) {
  basicExample();
  functionExample();
}
```

## Когда использовать
При трансформации или связывании операций Result

## Ключевые функции
- `Err`
- `Ok`
- `Result`

## Связанные концепции
- [[Err]]
- [[Ok]]
- [[Result]]

## Метаданные
- **Теги:** 
- **Сложность:** Средний
- **Модуль:**

---

# Как мне error result values with custom error types for better обработать ошибки and type safety?

## Краткий ответ
Используйте Err для обработки.

## Подробное объяснение
error Result values with custom error types for better Обработка ошибок and type safety.

## Пример кода
```typescript
import { Err, type Result } from '@resultsafe/core-fp-result';

interface ApiError {
  code: number;
  message: string;
}

const error: Result<never, ApiError> = Err({
  code: 500,
  message: 'Server error',
});

console.log(error); // { ok: false, error: { code: 500, message: 'Server error' } }
```

## Когда использовать
При трансформации или связывании операций Result

## Ключевые функции
- `Err`
- `Result`

## Связанные концепции
- [[Err]]
- [[Result]]

## Метаданные
- **Теги:** 
- **Сложность:** Средний
- **Модуль:**

---

# Как мне err in использовать в продакшне code for api errors, validation failures, and error propagation?

## Краткий ответ
Используйте Err, Ok для обработки.

## Подробное объяснение
Err in Продакшн code for API errors, Валидация failures, and error propagation.

## Пример кода
```typescript
import { Err, Ok, type Result } from '@resultsafe/core-fp-result';

interface User {
  id: string;
  name: string;
}

interface ApiError {
  status: number;
  message: string;
}

type UserResult = Result<User, ApiError>;

const fetchUser = async (id: string): Promise<UserResult> => {
  try {
    const response = await fetch(`/api/users/${id}`);

    if (!response.ok) {
      return Err({
        status: response.status,
        message: response.statusText,
      });
    }

    const data = (await response.json()) as User;
    return Ok(data);
  } catch (error) {
    return Err({
      status: 0,
      message: error instanceof Error ? error.message : 'Network error',
    });
  }
};

if (require.main === module) {
  fetchUser('user-1').then(console.log);
}
```

## Когда использовать
При трансформации или связывании операций Result

## Ключевые функции
- `Err`
- `Ok`
- `Result`

## Связанные концепции
- [[Err]]
- [[Ok]]
- [[Result]]

## Метаданные
- **Теги:** 
- **Сложность:** Средний
- **Модуль:**

---

# Как мне to use isok to check if a result is ok?

## Краткий ответ
Используйте Err, Ok для обработки.

## Подробное объяснение
to use isOk to check if a Result is Ok. This type guard narrows the type and enables safe value access.

## Пример кода
```typescript
import { Err, Ok, isOk } from '@resultsafe/core-fp-result';

const a = Ok(42);
const b = Err('boom');

console.log('a is ok:', isOk(a));
console.log('b is ok:', isOk(b));
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

# Как мне to use iserr to check if a result is err?

## Краткий ответ
Используйте Err, Ok для обработки.

## Подробное объяснение
to use isErr to check if a Result is Err. This type guard narrows the type and enables safe error access.

## Пример кода
```typescript
import { Err, Ok, isErr } from '@resultsafe/core-fp-result';

const a = Ok(42);
const b = Err('boom');

console.log('a is err:', isErr(a));
console.log('b is err:', isErr(b));
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

# Как мне to use isokand to check if a result is ok and satisfies a predicate?

## Краткий ответ
Используйте Ok для обработки.

## Подробное объяснение
to use isOkAnd to check if a Result is Ok and satisfies a predicate. Combines type narrowing with custom Валидация logic.

## Пример кода
```typescript
import { Ok, isOkAnd } from '@resultsafe/core-fp-result';

const result = Ok({ id: 'u-1', active: true });

const isActiveUser = isOkAnd(
  result,
  (value) => value.active === true && value.id.length > 0,
);

console.log('is active user:', isActiveUser);
```

## Когда использовать
При трансформации или связывании операций Result

## Ключевые функции
- `Ok`

## Связанные концепции
- [[Ok]]

## Метаданные
- **Теги:** 
- **Сложность:** Средний
- **Модуль:**

---

# Как мне to use iserrand to check if a result is err and satisfies a predicate?

## Краткий ответ
Используйте Err для обработки.

## Подробное объяснение
to use isErrAnd to check if a Result is Err and satisfies a predicate. Combines type narrowing with custom error Валидация logic.

## Пример кода
```typescript
import { Err, isErrAnd } from '@resultsafe/core-fp-result';

const result = Err({ code: 503, message: 'Service unavailable' });

const isRetryable = isErrAnd(result, (error) => error.code >= 500);

console.log('retryable:', isRetryable);
```

## Когда использовать
При трансформации или связывании операций Result

## Ключевые функции
- `Err`

## Связанные концепции
- [[Err]]

## Метаданные
- **Теги:** 
- **Сложность:** Средний
- **Модуль:**

---

# Как мне to use map to transform the ok value of a result?

## Краткий ответ
Используйте Ok, map для обработки.

## Подробное объяснение
to use map to transform the Ok value of a Result. Applies a function to the value if present, preserving Err unchanged.

## Пример кода
```typescript
import { Ok, map } from '@resultsafe/core-fp-result';

const source = Ok(21);
const doubled = map(source, (value) => value * 2);

console.log(doubled);
```

## Когда использовать
При трансформации или связывании операций Result

## Ключевые функции
- `Ok`
- `map`

## Связанные концепции
- [[Ok]]
- [[map]]

## Метаданные
- **Теги:** 
- **Сложность:** Средний
- **Модуль:**

---

# Как мне to use maperr to transform the error value of a result?

## Краткий ответ
Используйте Err для обработки.

## Подробное объяснение
to use mapErr to transform the error value of a Result. Applies a function to the error if present, preserving Ok unchanged.

## Пример кода
```typescript
import { Err, mapErr } from '@resultsafe/core-fp-result';

const source = Err({ code: 'E_IO' });
const normalized = mapErr(source, (error) => `code:${error.code}`);

console.log(normalized);
```

## Когда использовать
При трансформации или связывании операций Result

## Ключевые функции
- `Err`

## Связанные концепции
- [[Err]]

## Метаданные
- **Теги:** 
- **Сложность:** Средний
- **Модуль:**

---

# Как мне to use andthen to chain result-returning functions?

## Краткий ответ
Используйте Err, Ok, andThen для обработки.

## Подробное объяснение
to use andThen to chain Result-returning functions. Flatmaps the result, enabling sequential operations without nesting.

## Пример кода
```typescript
import { Err, Ok, andThen } from '@resultsafe/core-fp-result';

const parsePort = (raw: string) => {
  const port = Number(raw);
  return Number.isInteger(port) ? Ok(port) : Err('invalid-port');
};

const value = andThen(Ok('8080'), parsePort);
console.log(value);
```

## Когда использовать
При трансформации или связывании операций Result

## Ключевые функции
- `Err`
- `Ok`
- `andThen`

## Связанные концепции
- [[Err]]
- [[Ok]]
- [[andThen]]

## Метаданные
- **Теги:** 
- **Сложность:** Средний
- **Модуль:**

---

# Как мне to use orelse to provide a fallback result when the current result is err?

## Краткий ответ
Используйте Err, Ok для обработки.

## Подробное объяснение
to use orElse to provide a fallback Result when the current Result is Err. Enables recovery and alternative value chains.

## Пример кода
```typescript
import { Err, Ok, orElse } from '@resultsafe/core-fp-result';

const fallback = orElse(Err('network'), () => Ok('cached-value'));

console.log(fallback);
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

# Как мне to use unwrap to extract the ok value from a result?

## Краткий ответ
Используйте Ok, unwrap для обработки.

## Подробное объяснение
to use unwrap to extract the Ok value from a Result. Panics if the Result is Err - use only when you're certain of success.

## Пример кода
```typescript
import { Ok, unwrap } from '@resultsafe/core-fp-result';

const value = unwrap(Ok(99));
console.log(value);
```

## Когда использовать
При трансформации или связывании операций Result

## Ключевые функции
- `Ok`
- `unwrap`

## Связанные концепции
- [[Ok]]
- [[unwrap]]

## Метаданные
- **Теги:** 
- **Сложность:** Средний
- **Модуль:**

---

# Как мне to use unwrapor to extract the ok value or return a default?

## Краткий ответ
Используйте Err, Ok для обработки.

## Подробное объяснение
to use unwrapOr to extract the Ok value or return a default. Safe extraction that never panics.

## Пример кода
```typescript
import { Err, Ok, unwrapOr } from '@resultsafe/core-fp-result';

console.log(unwrapOr(Ok(7), 0));
console.log(unwrapOr(Err('boom'), 0));
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

# Как мне to use expect to extract the ok value with a custom panic message?

## Краткий ответ
Используйте Ok, expect для обработки.

## Подробное объяснение
to use expect to extract the Ok value with a custom panic message. Like unwrap but provides better error context when failing.

## Пример кода
```typescript
import { Ok, expect } from '@resultsafe/core-fp-result';

const value = expect(Ok('ready'), 'must be ok');
console.log(value);
```

## Когда использовать
При трансформации или связывании операций Result

## Ключевые функции
- `Ok`
- `expect`

## Связанные концепции
- [[Ok]]
- [[expect]]

## Метаданные
- **Теги:** 
- **Сложность:** Средний
- **Модуль:**

---

# Как мне to use unwraperr to extract the error value from a result?

## Краткий ответ
Используйте Err для обработки.

## Подробное объяснение
to use unwrapErr to extract the error value from a Result. Panics if the Result is Ok - use only when expecting errors.

## Пример кода
```typescript
import { Err, unwrapErr } from '@resultsafe/core-fp-result';

const error = unwrapErr(Err({ code: 'E_DB' }));
console.log(error.code);
```

## Когда использовать
При трансформации или связывании операций Result

## Ключевые функции
- `Err`

## Связанные концепции
- [[Err]]

## Метаданные
- **Теги:** 
- **Сложность:** Средний
- **Модуль:**

---

# Как мне to use expecterr to extract the error value with a custom panic message?

## Краткий ответ
Используйте Err для обработки.

## Подробное объяснение
to use expectErr to extract the error value with a custom panic message. Like unwrapErr but provides better error context when failing.

## Пример кода
```typescript
import { Err, expectErr } from '@resultsafe/core-fp-result';

const error = expectErr(Err('fatal'), 'must be err');
console.log(error);
```

## Когда использовать
При трансформации или связывании операций Result

## Ключевые функции
- `Err`

## Связанные концепции
- [[Err]]

## Метаданные
- **Теги:** 
- **Сложность:** Средний
- **Модуль:**

---

# Как мне to use unwraporelse to extract the ok value or compute a default lazily?

## Краткий ответ
Используйте Err, Ok для обработки.

## Подробное объяснение
to use unwrapOrElse to extract the Ok value or compute a default lazily. Safe extraction with deferred computation for expensive defaults.

## Пример кода
```typescript
import { Err, Ok, unwrapOrElse } from '@resultsafe/core-fp-result';

console.log(unwrapOrElse(Ok(7), () => 0));
console.log(unwrapOrElse(Err('boom'), (e) => e.length));
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

# Как мне to use tap to perform side effects on ok values without modifying the result?

## Краткий ответ
Используйте Ok, tap для обработки.

## Подробное объяснение
to use tap to perform side effects on Ok values without modifying the Result. Useful for logging, debugging, or intermediate operations.

## Пример кода
```typescript
import { Ok, tap } from '@resultsafe/core-fp-result';

const result = tap(Ok(10), (value) => {
  console.log('side effect with:', value);
});

console.log(result);
```

## Когда использовать
При трансформации или связывании операций Result

## Ключевые функции
- `Ok`

## Связанные концепции
- [[Ok]]

## Метаданные
- **Теги:** 
- **Сложность:** Средний
- **Модуль:**

---

# Как мне to use taperr to perform side effects on err values without modifying the result?

## Краткий ответ
Используйте Err для обработки.

## Подробное объяснение
to use tapErr to perform side effects on Err values without modifying the Result. Useful for error logging, debugging, or telemetry.

## Пример кода
```typescript
import { Err, tapErr } from '@resultsafe/core-fp-result';

const result = tapErr(Err('fatal'), (error) => {
  console.log('side effect for error:', error);
});

console.log(result);
```

## Когда использовать
При трансформации или связывании операций Result

## Ключевые функции
- `Err`

## Связанные концепции
- [[Err]]

## Метаданные
- **Теги:** 
- **Сложность:** Средний
- **Модуль:**

---

# Как мне to use inspect to observe ok values with a callback for debugging?

## Краткий ответ
Используйте Ok, inspect для обработки.

## Подробное объяснение
to use inspect to observe Ok values with a callback for debugging. Like tap but designed for inspection without side effects.

## Пример кода
```typescript
import { Ok, inspect } from '@resultsafe/core-fp-result';

const result = inspect(Ok({ id: 'u-1' }), (value) => {
  console.log('observed id:', value.id);
});

console.log(result);
```

## Когда использовать
При трансформации или связывании операций Result

## Ключевые функции
- `Ok`

## Связанные концепции
- [[Ok]]

## Метаданные
- **Теги:** 
- **Сложность:** Средний
- **Модуль:**

---

# Как мне to use inspecterr to observe err values with a callback for debugging?

## Краткий ответ
Используйте Err для обработки.

## Подробное объяснение
to use inspectErr to observe Err values with a callback for debugging. Like tapErr but designed for inspection without side effects.

## Пример кода
```typescript
import { Err, inspectErr } from '@resultsafe/core-fp-result';

const result = inspectErr(Err({ code: 'E_AUTH' }), (error) => {
  console.log('observed error:', error.code);
});

console.log(result);
```

## Когда использовать
При трансформации или связывании операций Result

## Ключевые функции
- `Err`

## Связанные концепции
- [[Err]]

## Метаданные
- **Теги:** 
- **Сложность:** Средний
- **Модуль:**

---

# Как мне to use match for exhaustive использовать pattern matching on result?

## Краткий ответ
Используйте Err, Ok, match для обработки.

## Подробное объяснение
to use match for exhaustive Сопоставление паттернов on Result. Handles both Ok and Err cases with type-safe callbacks.

## Пример кода
```typescript
import { Err, Ok, match } from '@resultsafe/core-fp-result';

const a = match(
  Ok(5),
  (v) => `ok:${v}`,
  (e) => `err:${e}`,
);
const b = match(
  Err('boom'),
  (v) => `ok:${v}`,
  (e) => `err:${e}`,
);

console.log(a);
console.log(b);
```

## Когда использовать
При трансформации или связывании операций Result

## Ключевые функции
- `Err`
- `Ok`
- `match`

## Связанные концепции
- [[Err]]
- [[Ok]]
- [[match]]

## Метаданные
- **Теги:** 
- **Сложность:** Средний
- **Модуль:**

---

# Как мне to use flatten to collapse nested result types?

## Краткий ответ
Используйте Err, Ok для обработки.

## Подробное объяснение
to use flatten to collapse nested Result types. Converts Result<Result<T, E>, E> into Result<T, E> for cleaner chaining.

## Пример кода
```typescript
import { Err, Ok, flatten } from '@resultsafe/core-fp-result';

console.log(flatten(Ok(Ok(10))));
console.log(flatten(Ok(Err('inner'))));
console.log(flatten(Err('outer')));
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

# Как мне to use transpose to convert between result<option<t>> and option<result<t>>?

## Краткий ответ
Используйте Err, Ok для обработки.

## Подробное объяснение
to use transpose to convert between Result<Option<T>> and Option<Result<T>>. Enables working with combined types in functional pipelines.

## Пример кода
```typescript
import { Err, Ok, transpose } from '@resultsafe/core-fp-result';

console.log(transpose(Ok({ some: true, value: 5 })));
console.log(transpose(Ok({ some: false })));
console.log(transpose(Err('boom')));
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

# Как мне to use ok to check if a result is ok and return a boolean?

## Краткий ответ
Используйте Err, Ok для обработки.

## Подробное объяснение
to use ok to check if a Result is Ok and return a boolean. Simple predicate for conditional logic without type narrowing.

## Пример кода
```typescript
import { Err, Ok, ok } from '@resultsafe/core-fp-result';

console.log(ok(Ok(1)));
console.log(ok(Err('x')));
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

# Как мне to use err to check if a result is err and return a boolean?

## Краткий ответ
Используйте Err, Ok для обработки.

## Подробное объяснение
to use err to check if a Result is Err and return a boolean. Simple predicate for conditional logic without type narrowing.

## Пример кода
```typescript
import { Err, Ok, err } from '@resultsafe/core-fp-result';

console.log(err(Err('x')));
console.log(err(Ok(1)));
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

# Как мне to use istypedvariant to create a type guard for a specific variant type?

## Краткий ответ
Используйте  для обработки.

## Подробное объяснение
to use isTypedVariant to create a type guard for a specific variant type. Narrows discriminated union types at runtime.

## Пример кода
```typescript
import { isTypedVariant } from '@resultsafe/core-fp-result';

const isCreated = isTypedVariant('created');

console.log(isCreated({ type: 'created', id: '1' }));
console.log(isCreated({ type: 'deleted', id: '1' }));
```

## Когда использовать
При трансформации или связывании операций Result

## Ключевые функции


## Связанные концепции


## Метаданные
- **Теги:** 
- **Сложность:** Средний
- **Модуль:**

---

# Как мне to use istypedvariantof to create a type guard that checks both variant type and required properties?

## Краткий ответ
Используйте  для обработки.

## Подробное объяснение
to use isTypedVariantOf to create a type guard that checks both variant type and required properties. Enhanced narrowing for complex unions.

## Пример кода
```typescript
import { isTypedVariantOf } from '@resultsafe/core-fp-result';

const isCreatedWithId = isTypedVariantOf<'created', { id: unknown }>('created');

console.log(isCreatedWithId({ type: 'created', id: '1' }));
console.log(isCreatedWithId({ type: 'created' }));
```

## Когда использовать
При трансформации или связывании операций Result

## Ключевые функции


## Связанные концепции


## Метаданные
- **Теги:** 
- **Сложность:** Средний
- **Модуль:**

---

# Как мне to use matchvariant for exhaustive использовать pattern matching on discriminated union variants?

## Краткий ответ
Используйте  для обработки.

## Подробное объяснение
to use matchVariant for exhaustive Сопоставление паттернов on discriminated union variants. Builder-style API for clean, type-safe branching.

## Пример кода
```typescript
import { matchVariant } from '@resultsafe/core-fp-result';

type Event =
  | { type: 'created'; id: string }
  | { type: 'failed'; reason: string };

const event: Event = { type: 'created', id: '42' };

const output = matchVariant<Event>(event)
  .with('created', (value) => `created:${value.id}`)
  .with('failed', (value) => `failed:${value.reason}`)
  .otherwise(() => 'fallback')
  .run();

console.log(output);
```

## Когда использовать
При трансформации или связывании операций Result

## Ключевые функции


## Связанные концепции


## Метаданные
- **Теги:** 
- **Сложность:** Средний
- **Модуль:**

---

# Как мне to use matchvariantstrict for strictly exhaustive использовать pattern matching without fallback?

## Краткий ответ
Используйте  для обработки.

## Подробное объяснение
to use matchVariantStrict for strictly exhaustive Сопоставление паттернов without fallback. Type-safe matching that requires all variants to be handled.

## Пример кода
```typescript
import { matchVariantStrict } from '@resultsafe/core-fp-result';

type Event =
  | { type: 'created'; id: string }
  | { type: 'failed'; reason: string };

const event: Event = { type: 'failed', reason: 'timeout' };

const output = matchVariantStrict<Event>(event)
  .with('created', (value) => `created:${value.id}`)
  .with('failed', (value) => `failed:${value.reason}`)
  .run();

console.log(output);
```

## Когда использовать
При трансформации или связывании операций Result

## Ключевые функции


## Связанные концепции


## Метаданные
- **Теги:** 
- **Сложность:** Средний
- **Модуль:**

---

# Как мне to use refineresult for runtime validation of variant data?

## Краткий ответ
Используйте  для обработки.

## Подробное объяснение
to use refineResult for runtime Валидация of variant data. Returns Result with validated data or Валидация error.

## Пример кода
```typescript
import { refineResult } from '@resultsafe/core-fp-result';

const variantMap = {
  created: { payload: ['id', 'meta'] },
  failed: { payload: 'reason' },
} as const;

const refineCreated = refineResult(variantMap)('created')({
  id: (value: unknown): value is string => typeof value === 'string',
  meta: (value: unknown): value is number => typeof value === 'number',
});

console.log(refineCreated({ type: 'created', id: '42', meta: 1 }));
console.log(refineCreated({ type: 'created', id: 42, meta: 1 }));
```

## Когда использовать
При трансформации или связывании операций Result

## Ключевые функции


## Связанные концепции


## Метаданные
- **Теги:** 
- **Сложность:** Средний
- **Модуль:**

---

# Как мне to use refineresultu for runtime validation with uncurried api?

## Краткий ответ
Используйте  для обработки.

## Подробное объяснение
to use refineResultU for runtime Валидация with uncurried API. Single function call variant of refineResult for simpler syntax.

## Пример кода
```typescript
import { refineResultU } from '@resultsafe/core-fp-result';

const variantMap = {
  created: { payload: ['id', 'meta'] },
  failed: { payload: 'reason' },
} as const;

const refined = refineResultU(
  { type: 'created', id: '42', meta: 1 },
  'created',
  variantMap,
  {
    id: (value: unknown): value is string => typeof value === 'string',
    meta: (value: unknown): value is number => typeof value === 'number',
  },
);

console.log(refined);
```

## Когда использовать
При трансформации или связывании операций Result

## Ключевые функции


## Связанные концепции


## Метаданные
- **Теги:** 
- **Сложность:** Средний
- **Модуль:**

---

# Как мне to use refineasyncresult for async runtime validation of variant data?

## Краткий ответ
Используйте  для обработки.

## Подробное объяснение
to use refineАсинхронныйResult for Асинхронный runtime Валидация of variant data. Returns Promise<Result> with validated data or Валидация error.

## Пример кода
```typescript
import { refineAsyncResult } from '@resultsafe/core-fp-result';

const variantMap = {
  created: { payload: ['id', 'meta'] },
  failed: { payload: 'reason' },
} as const;

async function main(): Promise<void> {
  const refineCreated = refineAsyncResult(variantMap)('created')({
    id: async (value: unknown) => typeof value === 'string',
    meta: async (value: unknown) => typeof value === 'number',
  });

  console.log(await refineCreated({ type: 'created', id: '42', meta: 1 }));
  console.log(await refineCreated({ type: 'created', id: 42, meta: 1 }));
}

await main();
```

## Когда использовать
При трансформации или связывании операций Result

## Ключевые функции


## Связанные концепции


## Метаданные
- **Теги:** 
- **Сложность:** Средний
- **Модуль:**

---

# Как мне to use refineasyncresultu for async runtime validation with uncurried api?

## Краткий ответ
Используйте  для обработки.

## Подробное объяснение
to use refineАсинхронныйResultU for Асинхронный runtime Валидация with uncurried API. Single function call variant of refineАсинхронныйResult for simpler syntax.

## Пример кода
```typescript
import { refineAsyncResultU } from '@resultsafe/core-fp-result';

const variantMap = {
  created: { payload: ['id', 'meta'] },
  failed: { payload: 'reason' },
} as const;

async function main(): Promise<void> {
  const refined = await refineAsyncResultU(
    { type: 'created', id: '42', meta: 1 },
    'created',
    variantMap,
    {
      id: async (value: unknown) => typeof value === 'string',
      meta: async (value: unknown) => typeof value === 'number',
    },
  );

  console.log(refined);
}

await main();
```

## Когда использовать
При трансформации или связывании операций Result

## Ключевые функции


## Связанные концепции


## Метаданные
- **Теги:** 
- **Сложность:** Средний
- **Модуль:**

---

# Как мне to use refinevariantmap for runtime validation across multiple variant types?

## Краткий ответ
Используйте  для обработки.

## Подробное объяснение
to use refineVariantMap for runtime Валидация across multiple variant types. Single API for validating any variant in a union with comprehensive validators.

## Пример кода
```typescript
import { refineVariantMap } from '@resultsafe/core-fp-result';

const variantMap = {
  created: { payload: ['id', 'meta'] },
  failed: { payload: 'reason' },
  ping: { payload: 'never' },
} as const;

const validators = {
  created: {
    id: (value: unknown): value is string => typeof value === 'string',
    meta: (value: unknown): value is number => typeof value === 'number',
  },
  failed: {
    reason: (value: unknown): value is string => typeof value === 'string',
  },
  ping: {},
} as const;

console.log(
  refineVariantMap(
    { type: 'created', id: '1', meta: 2 },
    variantMap,
    validators,
  ),
);
console.log(
  refineVariantMap({ type: 'failed', reason: 2 }, variantMap, validators),
);
```

## Когда использовать
При трансформации или связывании операций Result

## Ключевые функции


## Связанные концепции


## Метаданные
- **Теги:** 
- **Сложность:** Средний
- **Модуль:**