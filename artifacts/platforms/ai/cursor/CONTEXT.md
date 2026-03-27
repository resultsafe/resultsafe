# ResultSafe AI Context

## What is ResultSafe?

ResultSafe provides **type-safe error handling** for TypeScript using the Result type pattern from Rust.

## Core Philosophy

1. **Explicit errors** - No hidden exceptions
2. **Type safety** - Errors are part of the type
3. **Composability** - Chain operations safely
4. **Zero overhead** - No runtime cost

## Main Types

### Result<T, E>
```typescript
type Result<T, E> = 
  | { readonly ok: true; readonly value: T }
  | { readonly ok: false; readonly error: E };
```

### Ok<T, E>
```typescript
function Ok<T>(value: T): Result<T, never>;
```

### Err<T, E>
```typescript
function Err<E>(error: E): Result<never, E>;
```

## Common Use Cases

| Use Case | Pattern | Example |
|----------|---------|---------|
| API calls | Result + async | `async getUser(): Promise<Result<User, ApiError>>` |
| Validation | Result + validation | `validateEmail(email): Result<Email, ValidationError>` |
| File I/O | Result + sync | `readFile(path): Result<string, IOError>` |
| Math operations | Result + validation | `divide(a, b): Result<number, DivisionError>` |

## Key Functions

### Transformation
- `map(fn)` - Transform Ok value
- `mapErr(fn)` - Transform Error value
- `andThen(fn)` - Chain operations (flat map)
- `orElse(fn)` - Recovery from error

### Extraction
- `unwrap()` - Get value or throw
- `unwrapOr(default)` - Get value or default
- `expect(msg)` - Get value or throw with message
- `match(okFn, errFn)` - Pattern matching

### Side Effects
- `tap(fn)` - Execute for side effect on Ok
- `tapErr(fn)` - Execute for side effect on Err
- `inspect(fn)` - Debug Ok value
- `inspectErr(fn)` - Debug Error value

## File Structure
```
packages/core/fp/result/
├── src/
│   ├── constructors/   # Ok, Err
│   ├── guards/         # isOk, isErr
│   ├── methods/        # map, andThen, etc.
│   └── refiners/       # Type refinement
├── __examples__/       # 51 working examples
└── docs/              # Documentation
```

## Testing Patterns
Always test both success and error cases:
```typescript
// Success case
test('divide returns Ok for valid input', () => {
  expect(divide(10, 2)).toEqual(Ok(5));
});

// Error case
test('divide returns Err for zero divisor', () => {
  expect(divide(10, 0)).toEqual(Err('Division by zero'));
});
```

## Related Projects
- [Rust Result](https://doc.rust-lang.org/std/result/)
- [fp-ts Either](https://gcanti.github.io/fp-ts/modules/Either.ts.html)
- [neverthrow](https://github.com/supermacro/neverthrow)
