---
id: FEAT-NNN
uuid: <generate-uuid-v4>
title: "Feature title"
status: idea | planned | active | completed | cancelled
layer: authored
lang: en
scope: monorepo | cross-package
owner: Denis
created: YYYY-MM-DD
updated: YYYY-MM-DD
phase: PHASE-N
links: [SPEC-NNN, ADR-NNN]
packages: ["@resultsafe/pkg-a", "@resultsafe/pkg-b"]
---

# FEAT-NNN: [Feature title]

## Problem

[What user or developer problem this feature solves.
Use domain terms from DOMAIN.md.]

---

## Scope

**In scope:**
- [Item]

**Out of scope:**
- [Item]

---

## Affected packages

| Package | Change type |
|---------|-------------|
| `@resultsafe/pkg-a` | new API / breaking change / internal |

---

## Required contracts

| Contract | Status |
|----------|--------|
| [SPEC-NNN — symbol contract](../../specs/contracts/SPEC-NNN-*.md) | required / exists |

---

## Tasks

| ID | Title | Status |
|----|-------|--------|
| [TASK-NNN](../../tasks/active/TASK-NNN-*.md) | [title] | active |

---

## Acceptance criteria

- [ ] All contracts created (SPEC-010+) for new symbols
- [ ] All contracts linked from implementing package SPECs
- [ ] All tests pass (`pnpm test` in affected packages)
- [ ] Coverage thresholds met
- [ ] CHANGELOG.md updated in all affected packages
