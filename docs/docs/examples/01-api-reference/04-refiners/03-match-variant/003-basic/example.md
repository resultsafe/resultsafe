---
id: example
title: Example
sidebar_label: Example
description: Code example demonstrating usage



---

# Example



## Source

`packages/core/fp/result/__examples__/01-api-reference/04-refiners/03-match-variant/003-basic/example.ts`



## Code

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

---

**Category:** examples | **Since:** unknown
