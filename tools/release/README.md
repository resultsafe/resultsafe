# Release Versioning

This monorepo uses Changesets with independent package versions.

## Current publish policy

- Allowed npm publish packages are defined in `tools/release/publish-allowlist.json`.
- Current allowlist includes only `@resultsafe/core-fp-result`.
- Any package not present in the allowlist is blocked from publish.
- npm release artifact is published from `packages/core/fp/result/dist`.
- `@resultsafe/core-fp-result` uses `publishConfig.access=public` and `publishConfig.provenance=true`.
- `prepublishOnly` enforces `verify:release` before any publish command.

## SemVer policy

- `patch` - bug fixes, docs fixes, internal refactors with no public API behavior change.
- `minor` - backward-compatible API additions.
- `major` - breaking API or type-level behavior changes.

Any public API/type behavior change must include a changeset.

## Commands

- `pnpm changeset:add` - create a changeset file for package changes.
- `pnpm changeset:add:result -- --bump patch|minor|major --summary "..."` - create a ready-to-edit template changeset for `@resultsafe/core-fp-result`.
- `pnpm changeset:status` - inspect pending version changes.
- `pnpm changeset:check` - strict status output for CI diagnostics (local non-git environments are soft-skipped).
- `pnpm changeset:require-for-api` - blocks merge when API-sensitive changes exist without a `.changeset/*.md` file.
- `pnpm version:prepare` - apply changesets and update versions/changelogs.
- `pnpm release:verify` - run production verification for `core/fp/result`.
- `pnpm release:ci` - run versioning checks and release verification.
- `pnpm release:guard:result` - enforce publish allowlist for result package.
- `pnpm release:publish` - publish packages via Changesets (guarded).
- `pnpm release:publish:result` - guarded result-package release flow (`version:prepare` + publish).

## Monorepo standard scripts

Root (`/package.json`):
- `pnpm pkg:result:clean`
- `pnpm pkg:result:build`
- `pnpm pkg:result:test`
- `pnpm pkg:result:lint`
- `pnpm pkg:result:docs:api`
- `pnpm pkg:result:verify`

Packages root (`/packages/package.json`):
- `pnpm -C packages run pkg:result:clean`
- `pnpm -C packages run pkg:result:build`
- `pnpm -C packages run pkg:result:test`
- `pnpm -C packages run pkg:result:lint`
- `pnpm -C packages run pkg:result:docs:api`
- `pnpm -C packages run pkg:result:verify`

Result package (`/packages/core/fp/result/package.json`):
- `pnpm -C packages/core/fp/result run npm:publish:dry`
- `pnpm -C packages/core/fp/result run npm:publish:public`

## CI workflows

- `.github/workflows/ci-versioning.yml`:
  - runs on PR/push to `main`;
  - checks changeset status;
  - enforces API-change-to-changeset policy;
  - validates release readiness (`release:verify`).
- `.github/workflows/release-result.yml`:
  - manual `workflow_dispatch` release;
  - enforces allowlist;
  - verifies release;
  - applies versioning and publishes to npm;
  - requires `NPM_TOKEN` secret.

## Release checklist

1. Run `pnpm release:ci` locally.
2. Add changeset if API/type behavior changed.
3. Ensure only allowed package names are targeted for publish.
4. Trigger manual release workflow when ready.
