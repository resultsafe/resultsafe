---
id: ARCHITECTURE
uuid: a1b2c3d4-e5f6-7890-abcd-000000000005
title: "resultsafe — Architecture"
status: canonical
layer: authored
lang: en
scope: monorepo
owner: Denis
created: 2026-03-26
updated: 2026-03-26
links: [CONTEXT, DOMAIN]
---

# resultsafe — Architecture

<!-- AGENT: update this file only on architectural changes, not on every task -->

## Overview

resultsafe is organized as a pnpm monorepo. Packages are independently
versioned, published to npm, and have their own build pipelines.
The dependency graph between packages is acyclic.

---

## Multi-language strategy

```
Language-neutral contracts (docs/specs/contracts/)
        ↓              ↓              ↓
  TypeScript       Python         Other languages
  packages/        packages/       packages/
  core/fp/         python/fp/      .../
```

One contract defines behavior for all languages.
Each language implements the contract independently, using language idioms.
TypeScript is the first implementation — not the canonical reference.
The **contract** is the canonical reference.

---

## Package structure

```
resultsafe/
└── packages/
    ├── core/fp/                ← TypeScript functional primitives
    │   ├── result/             ← PRIMARY: Result<T,E> + all operations
    │   ├── result-shared/      ← shared types for result ecosystem
    │   ├── codec/              ← encode/decode with Result errors
    │   ├── context/            ← context propagation
    │   ├── do/                 ← do-notation style chaining
    │   ├── effect/             ← effectful computations
    │   ├── either/             ← Either type (Left/Right)
    │   ├── flow/               ← function composition
    │   ├── layer/              ← layered dependencies
    │   ├── option/             ← Option/Maybe type
    │   ├── option-shared/      ← shared types for option ecosystem
    │   ├── pipe/               ← pipe operator
    │   ├── shared/             ← shared utilities
    │   ├── task/               ← async task abstraction
    │   ├── task-result/        ← async result: Promise<Result<T,E>>
    │   ├── union/              ← discriminated union utilities
    │   ├── void/               ← void/unit type
    │   └── module-loader/      ← dynamic module loading
    └── adapter/
        └── core/fp/codec/zod/  ← zod adapter for codec package
```

---

## Per-package anatomy

Every package follows this layout:

```
package-name/
├── CHANGELOG.md               ← semver releases (Keep a Changelog)
├── README.md                  ← public documentation
├── README.*.md                ← translations (optional)
├── package.json
├── tsconfig.json
│
├── src/                       ← TypeScript source (authored)
│   ├── index.ts               ← public API: re-exports only
│   └── ...                    ← modules by domain concept
│
├── __tests__/                 ← tests (TDD — written before src/)
│   ├── unit/                  ← unit tests per module
│   ├── integration/           ← full API flow tests
│   └── types/                 ← type-level tests (expect-type / tsd)
│
├── __examples__/              ← runnable examples (source for docs/examples/)
│
├── __scripts__/               ← build and docs generation scripts
│   └── docs/
│       └── mirror-typedoc-api.mjs
│
├── config/                    ← tool configurations
│   ├── tsconfig.build.json
│   ├── tsconfig.build.types.json
│   ├── tsconfig.eslint.json
│   ├── typedoc.build.md.json
│   ├── typedoc.build.html.json
│   ├── typedoc.build.docusaurus.json
│   ├── vite.config.build.esm.ts
│   ├── vite.config.build.cjs.ts
│   ├── vite.config.build.umd.ts
│   ├── vite.config.shared.ts
│   └── vitest.config.ts
│
└── docs/
    ├── meta/                  ← AUTHORED documentation (agent works here)
    │   ├── MANIFEST.md
    │   ├── CONTEXT.md
    │   ├── specs/
    │   ├── decisions/
    │   ├── concepts/
    │   ├── tasks/
    │   │   ├── active/
    │   │   ├── backlog/
    │   │   ├── blocked/
    │   │   └── done/
    │   ├── registry/
    │   │   ├── COUNTERS.md    ← package-local, independent from root
    │   │   └── ENTITIES.md
    │   └── archive/
    ├── api/                   ← DERIVED: TypeDoc output, NOT committed
    └── examples/              ← DERIVED: from __examples__/, NOT committed
```

---

## Build outputs per TypeScript package

| Format | Path | Purpose |
|--------|------|---------|
| ESM | `dist/esm/` | Tree-shakeable modern JS |
| CJS | `dist/cjs/` | CommonJS interop |
| UMD | `dist/umd/` | Browser global / CDN |
| Types | `dist/types/` | TypeScript declarations (.d.ts) |
| API docs | `dist/docs/api/` | TypeDoc output — copied for npm consumers |
| Examples | `dist/docs/examples/` | Example docs — copied for npm consumers |

---

## Documentation generation pipeline

```
Source:  src/**/*.ts (TSDoc comments)
         __examples__/**/*.example.ts

Step 1:  typedoc --options config/typedoc.build.md.json
         → generates docs/api/ (flat structure)

Step 2:  node __scripts__/docs/mirror-typedoc-api.mjs
         → mirrors src/ structure: src/module/file.ts → docs/api/module/file.md
         → rewrites internal links
         → removes flat docs/api/functions/

Step 3:  examples script
         → generates docs/examples/ from __examples__/

Result:  docs/api/ and docs/examples/ → mirrored, not committed
         dist/docs/ ← copied for npm at publish time
```

---

## Key architectural decisions

| Decision | ADR |
|----------|-----|
| TDD as mandatory development standard | [ADR-001](../decisions/ADR-001-tdd-as-development-standard.md) |
| Contract-first cross-language API parity | [ADR-002](../decisions/ADR-002-cross-language-api-parity.md) |

---

## Related documents

- [CONTEXT.md](CONTEXT.md) — why the monorepo exists
- [DOMAIN.md](DOMAIN.md) — terminology
- [registry/PACKAGES.md](../registry/PACKAGES.md) — full package list
- [specs/contracts/](../specs/contracts/) — language-neutral API contracts
