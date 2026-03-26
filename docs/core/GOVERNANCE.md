---
id: GOVERNANCE
uuid: a1b2c3d4-e5f6-7890-abcd-000000000007
title: "resultsafe — Governance"
status: canonical
layer: authored
lang: en
scope: monorepo
owner: Denis
created: 2026-03-26
updated: 2026-03-26
---

# resultsafe — Governance

## Ownership

| Area | Owner | Responsibilities |
|------|-------|-----------------|
| Monorepo architecture | Denis | ADRs, language-neutral contracts, API decisions |
| Documentation system | Denis | RULES.md, MANIFEST.md, templates |
| TypeScript packages | Denis | all packages under `packages/core/fp/` |
| AI agent tasks | Denis | task authoring, review, acceptance |
| Release process | Denis | versioning, publishing, CHANGELOG |

## Decision process

### For architecture decisions (ADR)

1. Write `CONCEPT-NNN-*.md` after AI-session — `status: exploring`
2. Capture findings — `status: captured`
3. Write `ADR-NNN-*.md` with options and decision — `status: proposed`
4. Review: confirm ADR accurately reflects decision
5. Set `status: accepted`
6. Update all affected documents per ADR consequences section

### For language-neutral contracts (SPEC-010+)

1. Define symbol in `DOMAIN.md` if not already there
2. Write contract in `docs/specs/contracts/` using SPEC-002 template
3. Set `status: draft` → review against existing implementations
4. Set `status: canonical`
5. Update Implementations table in contract
6. Link from each implementing package's SPEC via `implements:`

### For process changes (SPEC-001..009, RULES.md)

1. Human only — agents do not change process docs without explicit task
2. Document reason in CHANGELOG.md

### For package-level decisions

Same as ADR process, but at package scope.

## AI agent authority

Agents are authorized to:
- Create and update TASK, CONCEPT, NOTE documents
- Create SPEC and ADR drafts when instructed
- Update MANIFEST, COUNTERS, CHANGELOG after completing tasks
- Add terms to DOMAIN.md when introducing new terminology
- Create package docs/meta/ structure

Agents are NOT authorized to (without explicit instruction):
- Accept or supersede ADRs
- Change RULES.md
- Change GOVERNANCE.md
- Change canonical contracts
- Delete any files

## Conflict resolution

When two documents conflict:
1. Higher priority source of truth wins (see RULES.md §18)
2. Mark the lower-priority document with `<!-- CONFLICT: -->`
3. Escalate to Denis for resolution

When contract and implementation conflict:
- Contract always wins
- Implementation is the bug
- Exception: TypeScript-specific behavior must be documented as parity deviation
