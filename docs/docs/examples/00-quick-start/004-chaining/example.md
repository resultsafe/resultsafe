---
id: example
title: Example
sidebar_label: Example
description: Code example demonstrating usage



---

# Example



## Source

`packages/core/fp/result/__examples__/00-quick-start/004-chaining/example.ts`



## Code

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

---

**Category:** examples | **Since:** unknown
