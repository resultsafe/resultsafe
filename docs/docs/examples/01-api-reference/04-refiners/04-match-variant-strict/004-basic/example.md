---
id: example
title: Example
sidebar_label: Example
description: Code example demonstrating usage



---

# Example



## Source

`packages/core/fp/result/__examples__/01-api-reference/04-refiners/04-match-variant-strict/004-basic/example.ts`



## Code

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

---

**Category:** examples | **Since:** unknown
