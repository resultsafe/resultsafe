---
id: TASK-003
uuid: a1b2c3d4-e5f6-7890-abcd-000000000052
title: "@since Automation — Backlog & Future Improvements"
status: backlog
layer: authored
lang: en
scope: monorepo
owner: Denis
created: 2026-03-26
updated: 2026-03-26
tags: [automation, jsdoc, eslint, since, tooling]
---

# @since Automation — Backlog & Future Improvements

> Tracking future improvements to the @since automation system.
> This is a **backlog** — tasks here are not urgent, but should be considered for future releases.

---

## Completed ✅

### Phase 1: Foundation (2026-03-26)

- [x] ESLint plugin `@resultsafe/eslint-plugin`
  - Rule: `require-since-version`
  - Location: `tools/eslint-plugin/`
  - Auto-fix: adds `@since {version}` from package.json

- [x] Migration script
  - File: `scripts/migrate-since-tags.mjs`
  - Supports `--dry-run` mode
  - Scans all TypeScript files in `src/`

- [x] Documentation
  - [SPEC-003](../../specs/SPEC-003-typedoc-documentation-standard.md) — Section 16: @since Automation
  - [AI-AGENT-RULES.md](../../packages/core/fp/result/docs/meta/AI-AGENT-RULES.md) — Package-specific rules
  - [PULL_REQUEST_TEMPLATE.md](../../.github/PULL_REQUEST_TEMPLATE.md) — PR checklist
  - [AI_DOC_FRAMEWORK.md](../../AI_DOC_FRAMEWORK.md) — Signal markers

- [x] Integration with `@resultsafe/core-fp-result`
  - ESLint config updated
  - All exports have `@since` tags
  - All checks pass (tests, lint, TypeDoc)

---

## Pending 🔄

### High Priority

#### 1. Changesets Hook — автоматическое обновление @since при релизе

**Status:** Not started

**Description:**
When a changeset is created for API changes, automatically:
- Detect new exports via git diff
- Add `@since Next` to new exports
- On release, replace `@since Next` with actual version

**Implementation:**
```javascript
// .changeset/hooks/before-commit.mjs
export default async function beforeCommit(changesets, config) {
  for (const changeset of changesets) {
    if (changeset.releases.some(r => r.type === 'minor' || r.type === 'major')) {
      const newVersion = calculateNextVersion(changeset);
      await updateSinceTags(changeset.releases[0].name, newVersion);
    }
  }
}
```

**Complexity:** Medium

**Dependencies:** None

**Files to create/modify:**
- `.changeset/hooks/before-commit.mjs`
- `tools/release/update-since-tags.mjs`

---

#### 2. GitHub Actions Workflow — валидация @since в CI

**Status:** Not started

**Description:**
Validate @since tags on every PR:
- Check all new exports have @since
- Block merge if missing
- Comment on PR with specific issues

**Implementation:**
```yaml
# .github/workflows/validate-since-tags.yml
name: Check @since tags

on:
  pull_request:
    paths:
      - 'packages/**/src/**/*.ts'

jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: node scripts/validate-since-tags.mjs
```

**Complexity:** Low

**Dependencies:** None

**Files to create:**
- `.github/workflows/validate-since-tags.yml`
- `scripts/validate-since-tags.mjs`

---

### Medium Priority

#### 3. Extend to all packages — применить правила ко всем пакетам core/fp/*

**Status:** Not started

**Description:**
Apply @since automation to all packages:
- `@resultsafe/core-fp-option`
- `@resultsafe/core-fp-option-shared`
- `@resultsafe/core-fp-result-shared`
- `@resultsafe/core-fp-union`
- `@resultsafe/core-fp-shared`

**Complexity:** Low (copy config + run migration)

**Dependencies:** Completed ✅ Phase 1

**Steps:**
1. Copy `tools/eslint-plugin/` to each package (or keep shared)
2. Update each package's `eslint.config.mjs`
3. Run `scripts/migrate-since-tags.mjs` for each package
4. Update root ESLint config for monorepo-wide checks

---

#### 4. Auto-fix improvements — исправить баги автофикса

**Status:** Known issues

**Description:**
Current auto-fix has bugs:
- Inserts @since in wrong position (breaks JSDoc structure)
- Multiple insertions on repeated runs
- Doesn't handle multi-line JSDoc correctly

**Fix required in:**
`tools/eslint-plugin/require-since-version.js`

**Specific issues:**
```javascript
// Current buggy logic:
const insertPos = comment.range[0]; // Wrong!

// Should be:
const insertPos = findPositionBeforeClosingTag(comment);
```

**Complexity:** Medium

**Dependencies:** None

---

### Low Priority

#### 5. Language detection — проверять, что JSDoc на английском

**Status:** Not started

**Description:**
Add ESLint rule to detect non-English text in JSDoc:
- Use `cspell` or custom dictionary
- Warn on Russian, Chinese, etc.
- Auto-fix: suggest translation (optional)

**Complexity:** Medium

**Dependencies:** None

**Files to create:**
- `tools/eslint-plugin/require-english.js`

---

#### 6. Version sync check — валидировать синхронизацию версий

**Status:** Not started

**Description:**
Validate that versions are synchronized:
- `package.json` version
- `@since` tags
- `CHANGELOG.md` entries
- Git tags (on release)

**Implementation:**
```bash
# scripts/validate-version-sync.mjs
node scripts/validate-version-sync.mjs

# Output:
# ✅ package.json: 0.1.8
# ✅ @since tags: all ≤ 0.1.8
# ✅ CHANGELOG.md: [0.1.8] section exists
# ❌ Git tag: v0.1.8 missing (not released yet)
```

**Complexity:** Low

**Dependencies:** None

---

## Signal Markers Reference

Use these markers in code and commits:

```markdown
<!-- @since-MISSING: export 'transform' has no @since tag -->
  Use when: ESLint rule is disabled or auto-fix failed
  Action: Run `pnpm lint:fix` or add @since manually

<!-- @since-OUTDATED: @since 0.1.0 but package is 0.1.8 -->
  Use when: Existing @since is older than current version
  Action: Do NOT fix — existing @since is correct (historical record)

<!-- @since-NEXT-REPLACED: replaced Next with 0.1.8 on release -->
  Use when: Changeset hook replaces @since Next with actual version
```

---

## Related Documents

| Document | Purpose |
|----------|---------|
| [SPEC-003](../../specs/SPEC-003-typedoc-documentation-standard.md) | TypeDoc documentation + @since automation |
| [AI_DOC_FRAMEWORK.md](../../AI_DOC_FRAMEWORK.md) | Documentation system rules |
| [AI-AGENT-RULES.md](../../packages/core/fp/result/docs/meta/AI-AGENT-RULES.md) | Package-specific rules |
| [PULL_REQUEST_TEMPLATE.md](../../.github/PULL_REQUEST_TEMPLATE.md) | PR checklist |
| [RULES.md](../../docs/RULES.md) | All documentation rules |

---

## Notes

- **@since tags are immutable** — once set, never change (historical record)
- **`@since Next` is for development only** — must be replaced with actual version on release
- **ESLint auto-fix is best-effort** — always review changes from `pnpm lint:fix`
