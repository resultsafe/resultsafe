---
id: TASK-NNN
uuid: <generate-uuid-v4>
title: "Short task description"
status: active
layer: authored
lang: en
scope: monorepo | package | cross-package
owner: Denis
created: YYYY-MM-DD
updated: YYYY-MM-DD
links: [SPEC-NNN, ADR-NNN]
# package: "@resultsafe/core-fp-result"        ← if scope: package
# packages: ["@a/pkg", "@b/pkg"]               ← if scope: cross-package
# blocked_by: TASK-NNN                          ← if blocked
---

# TASK-NNN: [Task title]

## Context

[What is happening in the project. Why this task exists.
What has already been done before it. Reference DOMAIN.md terms.]

---

## Non-negotiable rules

1. [Hard constraint 1]
2. [Hard constraint 2]
3. Do not run `git add`, `git commit`, or `git push`
4. Do not modify files outside the "Files to modify" table below

---

## Files to modify

| File | What to do |
|------|-----------|
| `docs/specs/SPEC-NNN-*.md` | [specific action] |

## Do not touch

| File | Reason |
|------|--------|
| `docs/RULES.md` | protected — human only |
| `packages/*/docs/api/` | derived layer |

---

## Steps

### Step 1: [Name]

[Specific instruction — no ambiguity]

### Step 2: [Name]

[Specific instruction]

---

## Completion criteria

- [ ] [Verifiable criterion 1]
- [ ] [Verifiable criterion 2]
- [ ] If src/ was modified: failing test written first (TDD RED phase)
- [ ] If src/ was modified: all tests pass (`pnpm test`)
- [ ] If src/ was modified: coverage thresholds met (`pnpm test:coverage`)
- [ ] If new contract added: `implements:` set in package SPEC
- [ ] Appropriate CHANGELOG.md updated
- [ ] MANIFEST.md updated if file composition changed
- [ ] COUNTERS.md updated for every new prefixed file created
- [ ] This task moved to `tasks/done/`
