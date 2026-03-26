---
id: NOTE-012
uuid: 1b66f449-6299-4487-bb48-de4e32fcf8bc
title: 'Evidence: critical-domain canonicalization (services-applications, observability, security)'
type: note
status: done
kb_lifecycle: legacy
owner: 'core-fp'
source_of_truth: self
created: 2026-03-23
updated: 2026-03-23
links: [SPEC-017, SPEC-018, SPEC-019, DOC-008, SPEC-016, RB-005]
tags: [evidence, remediation, governance, canonicalization, critical-domains]
lang: ru
translation_of: docs/notes/NOTE-012-critical-domain-canonicalization-evidence-2026-03-23.md
translation_status: actual
---

# NOTE-012: Evidence — critical-domain canonicalization

## Scope evidence

Подтверждение remediation по доменам:

- `services-applications`
- `observability`
- `security`

Цель evidence:

- закрыть exception-only coverage;
- зафиксировать canonical source-of-truth;
- подтвердить прохождение governance/release/RAG checks.

## Canonical artifacts

1. `SPEC-017` — services-applications canonical SoT.
2. `SPEC-018` — observability canonical SoT.
3. `SPEC-019` — security canonical SoT.

Интегрированные governance changes:

- `config/docs-critical-governance-matrix.json`
- `config/docs-canonical-inventory.json`
- `config/docs-owner-policy.json`
- `config/docs-source-of-truth-policy.json`
- `docs/obsidian/specs/identifier-registry/MONOREPO-ENTITY-CATALOG.json`

## Validation evidence (2026-03-23)

### 1. `docs verify`

Команда:

```bash
python -m tools.automation docs verify --root . --output-format json
```

Результат:

- `status = ok`
- `issues_count = 0`
- `missing_links_count = 0`

### 2. `docs governance-check` (`mode=main`)

Команда:

```bash
python -m tools.automation docs governance-check --root . --mode main --report-file dist/docs-governance/docs-governance-report-main.json --output-format json
```

Результат:

- `blocking_failures = 0`
- `canonical-coverage gate = passed`
- warning остаток не по critical-domain canonicalization: roadmap owner gaps

### 3. `docs registry-consistency-report` (`mode=release`)

Команда:

```bash
python -m tools.automation docs registry-consistency-report --root . --mode release --report-file dist/docs-governance/release-registry-consistency-report-release.json --markdown-file dist/docs-governance/release-registry-consistency-report-release.md --output-format json
```

Результат:

- `status = pass`
- `score = 100`
- `missing_canonical_critical_domains_count = 0`
- `approved_exceptions_count = 0`
- `missing_source_of_truth_critical_docs_count = 0`

### 4. `docs rag-governance-check` (`mode=main`)

Команда:

```bash
python -m tools.automation docs rag-governance-check --root . --mode main --report-file dist/docs-governance/rag-governance-report-main.json --markdown-file dist/docs-governance/rag-governance-report-main.md --output-format json
```

Результат:

- `status = pass`
- `blocking_failures = 0`
- `warning_failures = 0`
- `default_profile_contamination = 0`

## Evidence files

- `dist/docs-governance/docs-governance-report-main.json`
- `dist/docs-governance/release-registry-consistency-report-release.json`
- `dist/docs-governance/release-registry-consistency-report-release.md`
- `dist/docs-governance/rag-governance-report-main.json`
- `dist/docs-governance/rag-governance-report-main.md`

## Acceptance state

Критерии canonicalization по трем доменам выполнены:

1. canonical SoT docs созданы и связаны в governance matrix.
2. exception-only coverage снят.
3. release evidence подтверждает отсутствие missing canonical critical domains.
