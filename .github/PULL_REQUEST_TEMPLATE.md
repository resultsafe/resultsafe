## PR Checklist

### Documentation

- [ ] All new exports have `@since` tag (auto-added by ESLint `pnpm lint:fix`)
- [ ] JSDoc follows [SPEC-003](docs/specs/SPEC-003-typedoc-documentation-standard.md):
  - [ ] English only (no Russian, Chinese, etc.)
  - [ ] Summary: 1-3 sentences, starts with verb
  - [ ] `@typeParam` for generics
  - [ ] `@param` for each parameter
  - [ ] `@returns` for functions
  - [ ] `@throws` if applicable
  - [ ] `@example` with runnable code
  - [ ] `@public` modifier
- [ ] No trailing whitespace in JSDoc
- [ ] No HTML in JSDoc (use Markdown)

### Code Quality

- [ ] Tests pass: `pnpm pkg:result:test`
- [ ] Lint passes: `pnpm pkg:result:lint`
- [ ] TypeDoc validates: `pnpm pkg:result:docs:api:check`
- [ ] TDD followed (tests written before implementation)
- [ ] Both Ok and Err branches tested

### Changeset

- [ ] Changeset created for API changes: `pnpm changeset:add:result`
- [ ] Changeset type matches change:
  - `major` — breaking changes
  - `minor` — new features (new exports)
  - `patch` — bug fixes
- [ ] Changeset message describes what changed

### Type Safety

- [ ] TypeScript compiles: `pnpm build:types`
- [ ] No `any` types
- [ ] No unsafe assignments/calls
- [ ] Guard functions preserve type narrowing

### Contract Compliance

- [ ] Implementation matches contract (SPEC-NNN)
- [ ] Contract updated if signature changed
- [ ] Deviations documented with `<!-- PARITY-VIOLATION: ... -->`

---

## Related Documents

- [SPEC-001](docs/specs/SPEC-001-tdd-development-standard.md) — TDD standard
- [SPEC-003](docs/specs/SPEC-003-typedoc-documentation-standard.md) — TypeDoc + @since rules
- [AI_DOC_FRAMEWORK.md](AI_DOC_FRAMEWORK.md) — Documentation system
- [AI-AGENT-RULES.md](packages/core/fp/result/docs/meta/AI-AGENT-RULES.md) — Package-specific rules

---

## Signal Markers

Use these markers in code when human review is needed:

```markdown
<!-- QUESTION: unclear requirement -->
<!-- CONFLICT: file-A contradicts file-B -->
<!-- VIOLATION: broke rule X, reason: Y -->
<!-- @since-MISSING: export 'foo' has no @since -->
<!-- CONTRACT-MISSING: no SPEC for symbol X -->
<!-- PARITY-VIOLATION: impl deviates from SPEC-NNN -->
```

---

## Commands Reference

```bash
# Run all checks
pnpm pkg:result:test && pnpm pkg:result:lint && pnpm pkg:result:docs:api:check

# Auto-fix lint issues
pnpm lint:fix

# Build for release
pnpm build:release

# Verify release artifacts
pnpm verify:release

# Create changeset
pnpm changeset:add:result
```
