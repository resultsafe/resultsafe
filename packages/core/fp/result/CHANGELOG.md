# Changelog

All notable changes to this project will be documented in this file.

The format is based on Keep a Changelog and this project adheres to Semantic Versioning.

---

## [Unreleased]

### Added

- EN | RU README with import patterns, ESM/TS-Node integration, supported paths, versioning policy, contributing, release checklist.
- GitHub issue/PR templates and CI workflow example (types-only tests via tsd).
- License file guidance and packaging notes.

### Changed

- Documentation structure for clarity and accessibility (EN | RU switch, Contents).

### Fixed

- MIT license wording (“AS IS”).

---

## [1.0.0] - 2025-08-30

### Added

- Core types (types-only, no runtime):
  - Ok<T>
  - Err<E>
  - Result<T, E = string>
- Public entry points (stable):
  - Index re-export: @resultsafe-crates-core-result-core-types
  - Subpaths: /Ok, /Err, /Result
- README: installation (npm, yarn, pnpm), concept mapping Rust → TS, API, usage, import examples.
- Package configuration:
  - exports and typesVersions for index and subpaths
  - files whitelist (dist, README.md, LICENSE)
  - license: MIT

