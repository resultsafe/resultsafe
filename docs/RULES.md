---
id: RULES
uuid: a1b2c3d4-e5f6-7890-abcd-000000000002
title: "Documentation Rules"
status: canonical
layer: authored
lang: en
scope: monorepo
owner: Denis
created: 2026-03-26
updated: 2026-03-26
---

# Documentation Rules

> Single source of all documentation rules for the resultsafe monorepo.
> Applies to ALL packages without exception.
> On any conflict — this file wins.

## Quick navigation

| § | Section |
|---|---------|
| [1](#1-two-level-hierarchy) | Two-level hierarchy |
| [2](#2-naming) | Naming |
| [3](#3-frontmatter) | Frontmatter |
| [4](#4-language) | Language |
| [5](#5-layer-model) | Layer model |
| [6](#6-placement) | Placement |
| [7](#7-lifecycle) | Lifecycle |
| [8](#8-links) | Links |
| [9](#9-versioning) | Versioning |
| [10](#10-update-protocol) | Update protocol |
| [11](#11-deduplication) | Deduplication |
| [12](#12-agent-protocol) | Agent protocol |
| [13](#13-ai-concept-lifecycle) | AI concept lifecycle |
| [14](#14-contract-rules) | Contract rules |
| [15](#15-ddd-rules) | DDD rules |
| [16](#16-tdd-rules) | TDD rules |
| [17](#17-changelog-rules) | CHANGELOG rules |
| [18](#18-priority) | Priority of sources of truth |

---

## 1. Two-level hierarchy

The monorepo has exactly **two** documentation levels. Never mix them.

**Root** (`docs/`): knowledge that applies to the whole monorepo.
**Package** (`packages/*/docs/meta/`): knowledge scoped to one package.

### Routing table

| Content | Root | Package |
|---------|------|---------|
| Monorepo purpose | ✅ `core/CONTEXT.md` | — |
| Package purpose | — | ✅ `CONTEXT.md` |
| Cross-cutting architecture | ✅ `core/ARCHITECTURE.md` | — |
| Language-neutral contracts | ✅ `specs/contracts/` | — |
| Package implementation spec | — | ✅ `specs/` |
| Monorepo-wide ADR | ✅ `decisions/` | — |
| Package-only ADR | — | ✅ `decisions/` |
| DDD glossary | ✅ `core/DOMAIN.md` | — |
| Cross-package task | ✅ `tasks/` | — |
| Single-package task | — | ✅ `tasks/` |
| Package inventory | ✅ `registry/PACKAGES.md` | — |
| Root ID counters | ✅ `registry/COUNTERS.md` | — |
| Package ID counters | — | ✅ `registry/COUNTERS.md` |

---

## 2. Naming

### File format

```
PREFIX-NNN-slug.md
```

### Prefixes

| Prefix | Type | Home folder |
|--------|------|------------|
| `SPEC-` | Specification / contract | `specs/` or `specs/contracts/` |
| `ADR-` | Architecture decision record | `decisions/` |
| `TASK-` | Agent or developer task | `tasks/<status>/` |
| `CONCEPT-` | AI-session concept | `concepts/` |
| `POL-` | Organization policy | `specs/` |
| `RB-` | Runbook | `runbooks/` |
| `NOTE-` | Note, audit, research | `notes/` |
| `FEAT-` | Feature | `roadmap/features/` |
| `PHASE-` | Development phase | `roadmap/phases/` |

### Number format

- Standard: `001..099` (3 digits, leading zeros)
- `TASK-`, `NOTE-`: `001..999`
- `PHASE-`: single digit `0..9`
- **IDs are permanent** — never reused after deletion

### SPEC ID ranges

```
SPEC-001..009   process/operational specs (TDD, contracts standard, etc.)
SPEC-010+       language-neutral API contracts
```

### Slug rules

- Lowercase letters and digits only
- Words separated by hyphens
- Maximum 5 words
- Describes content, not container
- ✅ `tdd-development-standard`
- ✅ `map-contract`
- ❌ `my-spec-v2`, `spec-about-map`, `new-spec`

### Special files (no prefix, no number)

```
Root:     MANIFEST.md  RULES.md  CHANGELOG.md
core/:    CONTEXT.md  ARCHITECTURE.md  DOMAIN.md  GOVERNANCE.md
registry/ COUNTERS.md  PACKAGES.md  ENTITIES.md  LEGACY.md
Package:  CHANGELOG.md  README.md  MANIFEST.md  CONTEXT.md
```

### Forbidden

- ❌ Version in filename: `architecture-v8-final.md`
- ❌ Spaces: `my doc.md`
- ❌ Dates in filename (except `NOTE-NNN-audit-YYYY-MM-DD.md`)
- ❌ Generic names: `notes.md`, `temp.md`, `misc.md`
- ❌ Reusing a freed ID number
- ❌ Same ID at same scope level for two different documents

---

## 3. Frontmatter

Every `.md` in `docs/` and `packages/*/docs/meta/` (except `_generated/`):

```yaml
---
id: SPEC-001
uuid: 550e8400-e29b-41d4-a716-446655440000
title: "Human-readable title"
status: draft | review | canonical
layer: authored
lang: en
scope: monorepo | package | cross-package
owner: Denis | team-name | shared
created: YYYY-MM-DD
updated: YYYY-MM-DD
---
```

Optional fields:

```yaml
links: [SPEC-002, ADR-001]
tags: [tdd, result, ddd]
package: "@resultsafe/core-fp-result"
implements: SPEC-013
type: language-neutral-contract | implementation | process
superseded_by: ADR-NNN
packages: ["@a/pkg", "@b/pkg"]
blocked_by: TASK-NNN
```

### Field rules

| Field | Rule |
|-------|------|
| `uuid` | Mandatory. Generated once at creation. Never changes — even on rename or move. |
| `id` | Matches PREFIX + number in filename. |
| `lang` | Always `en`. No exceptions for authored documents. |
| `scope` | Always set: `monorepo`, `package`, or `cross-package`. |
| `owner` | Always set: a person handle, team name, or `shared`. |
| `created` | Set once. Never changes. |
| `updated` | Updated on every significant change to content. |
| `status` | Forward only: `draft → review → canonical`. |
| `canonical` | Cannot be edited without reverting to `review` first. |

---

## 4. Language

```
Canonical language: English — without exceptions.

— All authored documents in docs/ and packages/*/docs/meta/ are in English
— lang: en is mandatory in every authored document's frontmatter
— Translations are never a source of truth
— On conflict between translation and original — original always wins
— Translation organization is the responsibility of the publishing tool
```

---

## 5. Layer model

| Layer | Path | Source of truth | Editable |
|-------|------|----------------|---------|
| `authored` | `docs/`, `packages/*/docs/meta/` | ✅ primary | ✅ human + agent |
| `derived` | `packages/*/docs/api/`, `packages/*/docs/examples/` | ⚙️ never | ❌ scripts only |
| `legacy` | `*/archive/` | 📦 non-authoritative | ❌ read-only |

**Derived layer:**
- Generated by scripts — never edited manually
- `docs/api/` — TypeDoc via `__scripts__/docs/mirror-typedoc-api.mjs`
- `docs/examples/` — from `__examples__/`
- Not committed to git
- Source of truth = the script, not the output

---

## 6. Placement

### Root `docs/` — create here when:

| Document type | Folder |
|---------------|--------|
| Process / operational spec | `specs/SPEC-001..009-slug.md` |
| Language-neutral API contract | `specs/contracts/SPEC-010+-slug-contract.md` |
| Cross-cutting ADR | `decisions/ADR-NNN-slug.md` |
| AI concept (monorepo scope) | `concepts/CONCEPT-NNN-slug.md` |
| Development phase | `roadmap/phases/PHASE-N-slug.md` |
| Cross-package feature | `roadmap/features/FEAT-NNN-slug.md` |
| Cross-package task | `tasks/active/TASK-NNN-slug.md` |
| Operational procedure | `runbooks/RB-NNN-slug.md` |
| Research / audit | `notes/NOTE-NNN-slug.md` |
| Consumer guide | `guides/guide-slug.md` |

### Package `packages/*/docs/meta/` — create here when:

| Document type | Folder |
|---------------|--------|
| Package API implementation spec | `specs/SPEC-NNN-slug.md` |
| Package-only ADR | `decisions/ADR-NNN-slug.md` |
| Package AI concept | `concepts/CONCEPT-NNN-slug.md` |
| Package task | `tasks/active/TASK-NNN-slug.md` |

### Root-level files never in packages; package files never in root.

---

## 7. Lifecycle

### Document status transitions

```
draft → review → canonical
```

One direction only. `canonical` cannot be edited without reverting to `review`.

### Directory status transitions

```
planned → exists → archive → removed
```

One direction only. Reversal requires an ADR.

### Archiving procedure

```
WHEN to archive:
  — file is obsolete and replaced
  — content lost actuality
  — working document whose task is complete (TASK → done/)

HOW to archive:
  1. Move file to archive/ preserving the name
  2. Add to header: > 📦 ARCHIVED: [YYYY-MM-DD], replaced by [link]
  3. Change layer: legacy in frontmatter
  4. Update links from other documents → mark [ARCHIVED]
  5. Update MANIFEST.md

NEVER delete directly:
  — Always move to archive/ first
  — Delete only if no active links point to the file
```

---

## 8. Links

```markdown
Format: relative paths only
[Context](../core/CONTEXT.md)
[Section](../specs/SPEC-001-tdd.md#section-name)
[Contract](../specs/contracts/SPEC-013-map-contract.md)

Rules:
— Always relative paths, never absolute
— Link to authored layer only (not archive/, not _generated/)
— Link to source of truth, not to a derived document
— Not-yet-created document → [TODO: filename]
— Forbidden: circular links
— Forbidden: links from authored to _generated/

Cross-package links (from package to root):
  [Monorepo context](../../../../docs/core/CONTEXT.md)
  [Contract](../../../../docs/specs/contracts/SPEC-013-map-contract.md)
```

---

## 9. Versioning

```
— Document version lives ONLY in git (commits + tags)
— In filename: no v1, v2, final, updated, new
— In frontmatter: only updated: YYYY-MM-DD
— Monorepo change history → docs/CHANGELOG.md
— Package release history → packages/*/CHANGELOG.md (Keep a Changelog + semver)
— Decision history → ADR (never edit accepted ADRs)
— Radical content change → create new document, archive old
```

---

## 10. Update protocol

```
BEFORE updating:
  1. Find source of truth via MANIFEST.md
  2. Update only the source of truth
  3. Check that the change does not break links from other files

DURING update:
  1. Update updated: field in frontmatter
  2. Never change created: field

AFTER update:
  1. Add entry to appropriate CHANGELOG.md (if significant)
  2. Update MANIFEST.md if file composition changed
  3. Update COUNTERS.md (correct scope) if new prefixed file was created

FORBIDDEN:
  ❌ Update derived document instead of source of truth
  ❌ Add content to a file if a more appropriate file exists
  ❌ Leave outdated content without marking:
      → Mark: > ⚠️ DEPRECATED: [date]. Current: [link]
```

---

## 11. Deduplication

```
Signs of duplication:
  — Same term defined in two files
  — Same rule written in two places
  — Same component list in two registries

Elimination:
  1. Identify which file is source of truth
  2. In all others: replace content with a link
     > See: [RULES.md § Naming](../RULES.md#2-naming)
  3. Verify all links are consistent

Prevention:
  — Before creating a new section: check MANIFEST.md
  — On content conflict: higher-priority document always wins
```

---

## 12. Agent protocol

### Initialization — mandatory every session

```
1. Read AI_DOC_FRAMEWORK.md          → understand the system
2. Read docs/MANIFEST.md             → understand structure
3. Read docs/RULES.md (this file)    → understand rules
4. Read assigned TASK file           → understand what to do
5. Read scope-appropriate CONTEXT.md → if domain knowledge needed
6. For contract work: read DOMAIN.md + SPEC-002
```

### During work

```
1. Modify only files explicitly listed in the task
2. Do not create new files without explicit instruction
3. On ambiguity → <!-- QUESTION: text --> — do not guess
4. Update only source of truth, not derived
5. Check correct-scope COUNTERS.md before creating prefixed file
6. Update updated: in frontmatter of every modified file
7. Respect scope: — do not mix monorepo and package levels
8. For contract work: use language-neutral vocabulary (SPEC-002 §4)
9. For domain terms: check DOMAIN.md before introducing new terminology
```

### After completion

```
1. Update appropriate CHANGELOG.md
2. Move task from active/ to done/
3. Update MANIFEST.md if file composition changed
4. Update COUNTERS.md for every new prefixed file created
```

### Forbidden without explicit permission

```
❌ Delete files
❌ Rename files
❌ Create files outside docs/ or packages/*/docs/meta/
❌ Edit archive/ or _generated/
❌ Edit RULES.md
❌ Change id:, uuid:, created: in frontmatter
❌ Update COUNTERS.md without creating corresponding file
❌ Move content between root and package levels
❌ Write TypeScript/Python syntax in language-neutral contracts
❌ Use TypeScript implementation as reference instead of contract
❌ Introduce domain terms not in DOMAIN.md without updating DOMAIN.md first
```

### Signal markers

```markdown
<!-- QUESTION: text -->           unclear, needs clarification, do not guess
<!-- CONFLICT: A vs B on X -->    two docs disagree, higher priority wins
<!-- VIOLATION: text -->          rule broken, review required
<!-- SCOPE-ERROR: text -->        wrong level root vs package
<!-- CONTRACT-MISSING: text -->   no contract for symbol, create before implementing
<!-- PARITY-VIOLATION: text -->   impl deviates from contract, undocumented
<!-- TODO: text -->               placeholder, must be filled
```

---

## 13. AI concept lifecycle

### When to create a CONCEPT

```
✅ AI session > 15 minutes on one topic
✅ Architecture design / technology research
❌ Short Q&A → result goes directly to TASK or NOTE
❌ Implementation (code) → TASK + git
```

### Lifecycle

```
exploring → captured → promoted  (creates ADR + SPEC + TASK)
                     → rejected  (with reason documented)
                     → parked    (revisit later)
```

### TTL rule

CONCEPT in `captured` status for > 30 days → mandatory: promote, reject, or park.

### Session log

Must capture:
- Key decisions and why
- Rejected alternatives and why
- Context: what problem was being solved
- Open questions

Must NOT capture:
- Full chat log
- Intermediate code

---

## 14. Contract rules

Full rules in [SPEC-002](specs/SPEC-002-language-neutral-contract-standard.md).
Summary:

```
— Language-neutral contracts are in docs/specs/contracts/
— Contracts use SPEC-010+ IDs
— Contracts describe WHAT, never HOW
— No language syntax in contracts (no TypeScript, no Python)
— Contract is source of truth — implementation is never the reference
— Every implementation must link its contract via implements: SPEC-NNN
— Parity deviations must be documented — never silent
— Canonical contracts are immutable; changes create new SPEC-NNN
```

### Contract vocabulary (quick reference)

```
Allowed:   Ok(value), Err(error), fn, result, calls, returns, identical
Forbidden: result.ok, <T, E>, async/await, Optional, None, ., ->
```

---

## 15. DDD rules

```
— docs/core/DOMAIN.md is the single source of truth for all terminology
— Before introducing a new term: check DOMAIN.md
— If term is missing: add to DOMAIN.md in the same commit
— All documents (specs, ADRs, tasks) use terms exactly as defined in DOMAIN.md
— Domain entities define the vocabulary for API contracts
— Ubiquitous language: same term used in docs, code, tests, and discussions
— No synonyms: one concept = one term; document rejected synonyms in DOMAIN.md
```

---

## 16. TDD rules

Full rules in [SPEC-001](specs/SPEC-001-tdd-development-standard.md).
Summary:

```
— Every line of production code in src/ is written in response to a failing test
— Mandatory cycle: RED (failing test) → GREEN (minimum code) → REFACTOR
— Both Ok and Err branches must be tested — error paths are not optional
— Type-level tests are mandatory for all generic functions and type guards
— Tests reference their contract: // Verifies: SPEC-013 map contract
— Agent must follow TDD sequence: write test first, then implementation
```

---

## 17. CHANGELOG rules

### docs/CHANGELOG.md (root)

```
Format:   [YYYY-MM-DD] — Milestone title
          - Change 1
          - Change 2
          ref: TASK-NNN or ADR-NNN

Content:  Monorepo milestones, cross-cutting releases, major arch changes
NOT:      Individual package releases
```

### packages/*/CHANGELOG.md (per-package)

```
Format:   Keep a Changelog (https://keepachangelog.com)
          Sections: Added / Changed / Deprecated / Removed / Fixed / Security
          Versions: semver (https://semver.org)

Content:  Package-level releases
NOT:      Monorepo-level events
```

---

## 18. Priority of sources of truth

```
Priority  Source                                  Scope
────────  ──────────────────────────────────────  ──────────────────
1         docs/RULES.md                           entire monorepo
2         docs/core/GOVERNANCE.md                 process
3         docs/core/CONTEXT.md                    monorepo purpose
4         docs/core/ARCHITECTURE.md               current architecture
5         docs/core/DOMAIN.md                     all terminology
6         docs/specs/contracts/SPEC-NNN-*         ALL implementations
7         docs/specs/SPEC-001..009                process standards
8         docs/specs/SPEC-003                     TypeDoc documentation standard
9         docs/decisions/ADR-NNN-*                monorepo decisions
10        docs/registry/*                         inventories
11        packages/*/docs/meta/specs/*            package contracts
12        packages/*/docs/meta/decisions/*        package decisions
13        docs/roadmap/*                          planned work
14        tasks/*, concepts/*, notes/*            NOT source of truth
15        archive/*                               reference only
```

Rule: contract (6) always wins over TypeScript or any other implementation.
Rule: root docs never defer to package docs.
Rule: package docs may reference root docs as higher authority.
Rule: TypeDoc documentation (8) must be in English only — no exceptions.
