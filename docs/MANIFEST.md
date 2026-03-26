---
id: MANIFEST
uuid: a1b2c3d4-e5f6-7890-abcd-000000000001
title: "resultsafe — Documentation Map"
status: canonical
layer: authored
lang: en
scope: monorepo
owner: Denis
created: 2026-03-26
updated: 2026-03-26
---

# resultsafe — Documentation Map

> Updated: 2026-03-26

## Agent reading chain

```
Every session:
  1. AI_DOC_FRAMEWORK.md  → system rules
  2. This file            → structure
  3. docs/RULES.md        → all rules
  4. Assigned TASK        → what to do
```

## Quick routing

| Question | File |
|----------|------|
| Why does this monorepo exist? | [core/CONTEXT.md](core/CONTEXT.md) |
| How is the system structured? | [core/ARCHITECTURE.md](core/ARCHITECTURE.md) |
| What does domain term X mean? | [core/DOMAIN.md](core/DOMAIN.md) |
| Who owns what? | [core/GOVERNANCE.md](core/GOVERNANCE.md) |
| What is the TDD standard? | [specs/SPEC-001-tdd-development-standard.md](specs/SPEC-001-tdd-development-standard.md) |
| How do I write a contract? | [specs/SPEC-002-language-neutral-contract-standard.md](specs/SPEC-002-language-neutral-contract-standard.md) |
| Why TDD? | [decisions/ADR-001-tdd-as-development-standard.md](decisions/ADR-001-tdd-as-development-standard.md) |
| Why contract-first? | [decisions/ADR-002-cross-language-api-parity.md](decisions/ADR-002-cross-language-api-parity.md) |
| What packages exist? | [registry/PACKAGES.md](registry/PACKAGES.md) |
| What ID numbers are free? | [registry/COUNTERS.md](registry/COUNTERS.md) |
| Active agent tasks? | [tasks/active/](tasks/active/) |
| What is planned? | [roadmap/](roadmap/) |
| All API contracts? | [specs/contracts/](specs/contracts/) |

---

## Root documents

| File | Role | Status | Updated |
|------|------|--------|---------|
| [RULES.md](RULES.md) | All documentation rules | canonical | 2026-03-26 |
| [CHANGELOG.md](CHANGELOG.md) | Monorepo milestones | canonical | 2026-03-26 |
| [core/CONTEXT.md](core/CONTEXT.md) | Monorepo goals and context | canonical | 2026-03-26 |
| [core/ARCHITECTURE.md](core/ARCHITECTURE.md) | Monorepo architecture | canonical | 2026-03-26 |
| [core/DOMAIN.md](core/DOMAIN.md) | DDD glossary and entities | canonical | 2026-03-26 |
| [core/GOVERNANCE.md](core/GOVERNANCE.md) | Ownership and process | canonical | 2026-03-26 |
| [specs/SPEC-001](specs/SPEC-001-tdd-development-standard.md) | TDD standard | canonical | 2026-03-26 |
| [specs/SPEC-002](specs/SPEC-002-language-neutral-contract-standard.md) | Contract writing rules | canonical | 2026-03-26 |
| [specs/SPEC-003](specs/SPEC-003-typedoc-documentation-standard.md) | TypeDoc documentation + @since automation | canonical | 2026-03-26 |
| [decisions/ADR-001](decisions/ADR-001-tdd-as-development-standard.md) | Decision: TDD | accepted | 2026-03-26 |
| [decisions/ADR-002](decisions/ADR-002-cross-language-api-parity.md) | Decision: contract-first | accepted | 2026-03-26 |
| [registry/PACKAGES.md](registry/PACKAGES.md) | Package inventory | canonical | 2026-03-26 |
| [registry/COUNTERS.md](registry/COUNTERS.md) | Root ID counters | canonical | 2026-03-26 |
| [registry/ENTITIES.md](registry/ENTITIES.md) | Cross-cutting entities | canonical | 2026-03-26 |
| [registry/LEGACY.md](registry/LEGACY.md) | Deprecated elements | canonical | 2026-03-26 |

---

## API Contracts

| Contract | Symbol | Status |
|----------|--------|--------|
| [SPEC-010](specs/contracts/SPEC-010-result-type-contract.md) | `Result` type | canonical |
| [SPEC-011](specs/contracts/SPEC-011-ok-constructor-contract.md) | `Ok` constructor | canonical |
| [SPEC-012](specs/contracts/SPEC-012-err-constructor-contract.md) | `Err` constructor | canonical |
| [SPEC-013](specs/contracts/SPEC-013-map-contract.md) | `map` | canonical |
| SPEC-014..041 | remaining symbols | — draft in progress |

---

## Packages

| PACKAGE-ID | npm name | Path | Manifest |
|------------|----------|------|---------|
| PACKAGE-0001 | `@resultsafe/core-fp-codec` | `packages/core/fp/codec` | [meta/MANIFEST.md](../packages/core/fp/codec/docs/meta/MANIFEST.md) |
| PACKAGE-0002 | `@resultsafe/core-fp-codec-zod` | `packages/adapter/core/fp/codec/zod` | [meta/MANIFEST.md](../packages/adapter/core/fp/codec/zod/docs/meta/MANIFEST.md) |
| PACKAGE-0003 | `@resultsafe/core-fp-context` | `packages/core/fp/context` | [meta/MANIFEST.md](../packages/core/fp/context/docs/meta/MANIFEST.md) |
| PACKAGE-0004 | `@resultsafe/core-fp-do` | `packages/core/fp/do` | [meta/MANIFEST.md](../packages/core/fp/do/docs/meta/MANIFEST.md) |
| PACKAGE-0005 | `@resultsafe/core-fp-effect` | `packages/core/fp/effect` | [meta/MANIFEST.md](../packages/core/fp/effect/docs/meta/MANIFEST.md) |
| PACKAGE-0006 | `@resultsafe/core-fp-either` | `packages/core/fp/either` | [meta/MANIFEST.md](../packages/core/fp/either/docs/meta/MANIFEST.md) |
| PACKAGE-0007 | `@resultsafe/core-fp-flow` | `packages/core/fp/flow` | [meta/MANIFEST.md](../packages/core/fp/flow/docs/meta/MANIFEST.md) |
| PACKAGE-0008 | `@resultsafe/core-fp-layer` | `packages/core/fp/layer` | [meta/MANIFEST.md](../packages/core/fp/layer/docs/meta/MANIFEST.md) |
| PACKAGE-0009 | `@resultsafe/core-fp-option` | `packages/core/fp/option` | [meta/MANIFEST.md](../packages/core/fp/option/docs/meta/MANIFEST.md) |
| PACKAGE-0010 | `@resultsafe/core-fp-option-shared` | `packages/core/fp/option-shared` | [meta/MANIFEST.md](../packages/core/fp/option-shared/docs/meta/MANIFEST.md) |
| PACKAGE-0011 | `@resultsafe/core-fp-pipe` | `packages/core/fp/pipe` | [meta/MANIFEST.md](../packages/core/fp/pipe/docs/meta/MANIFEST.md) |
| PACKAGE-0012 | `@resultsafe/core-fp-result` | `packages/core/fp/result` | [meta/MANIFEST.md](../packages/core/fp/result/docs/meta/MANIFEST.md) |
| PACKAGE-0013 | `@resultsafe/core-fp-result-shared` | `packages/core/fp/result-shared` | [meta/MANIFEST.md](../packages/core/fp/result-shared/docs/meta/MANIFEST.md) |
| PACKAGE-0014 | `@resultsafe/core-fp-shared` | `packages/core/fp/shared` | [meta/MANIFEST.md](../packages/core/fp/shared/docs/meta/MANIFEST.md) |
| PACKAGE-0015 | `@resultsafe/core-fp-task` | `packages/core/fp/task` | [meta/MANIFEST.md](../packages/core/fp/task/docs/meta/MANIFEST.md) |
| PACKAGE-0016 | `@resultsafe/core-fp-task-result` | `packages/core/fp/task-result` | [meta/MANIFEST.md](../packages/core/fp/task-result/docs/meta/MANIFEST.md) |
| PACKAGE-0017 | `@resultsafe/core-fp-union` | `packages/core/fp/union` | [meta/MANIFEST.md](../packages/core/fp/union/docs/meta/MANIFEST.md) |
| PACKAGE-0018 | `@resultsafe/core-fp-void` | `packages/core/fp/void` | [meta/MANIFEST.md](../packages/core/fp/void/docs/meta/MANIFEST.md) |
| PACKAGE-0020 | `@resultsafe/core-fp-module-loader` | `packages/core/fp/module-loader` | [meta/MANIFEST.md](../packages/core/fp/module-loader/docs/meta/MANIFEST.md) |

---

## Folder index

| Folder | Purpose |
|--------|---------|
| `core/` | Sources of truth: context, architecture, domain, governance |
| `specs/` | Process specs (SPEC-001..009) + language-neutral contracts (SPEC-010+) |
| `decisions/` | Cross-cutting ADRs |
| `concepts/` | Cross-cutting AI concepts |
| `roadmap/` | Phases and features |
| `tasks/` | Agent tasks (monorepo / cross-package scope) |
| `runbooks/` | Operational procedures |
| `notes/` | Audits, research, gap analysis |
| `guides/` | Consumer-facing documentation |
| `registry/` | Inventories and counters |
| `_templates/` | Templates for new documents |
| `_generated/` | Auto-generated, do not edit |
| `archive/` | Deprecated documents, read-only |
