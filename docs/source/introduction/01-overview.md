---
id: overview
title: Overview
sidebar_label: Overview
description: Introduction to ResultSafe - Functional Result type for TypeScript
---

# ResultSafe

**Functional Result type for TypeScript with explicit error handling.**

## Features

- ✅ **Type-safe error handling** - Catch errors at compile time
- ✅ **Rust-style Result** - Familiar API for Rust developers
- ✅ **Zero dependencies** - Lightweight and tree-shakable
- ✅ **AI-friendly** - Comprehensive documentation for LLMs
- ✅ **Multi-language** - English and Russian support

## Quick Example

```typescript
import { Ok, Err, match } from '@resultsafe/core-fp-result';

const divide = (a: number, b: number) => {
  if (b === 0) {
    return Err('Division by zero');
  }
  return Ok(a / b);
};

const result = divide(10, 2);
match(
  result,
  (value) => console.log(value), // 5
  (error) => console.error(error)
);
```

## Installation

```bash
npm install @resultsafe/core-fp-result
```

## Next Steps

- [Installation](./02-installation.md) - Setup guide
- [Quick Start](./03-quick-start.md) - Get started in 5 minutes
- [API Reference](../api/core-fp-result/index.md) - Full API docs

## Learn More

- [Guides](../guides/index.md) - Usage patterns
- [Patterns](../patterns/index.md) - Real-world examples
- [GitHub](https://github.com/resultsafe/resultsafe) - Source code
