---
uuid: fe9d796a-1efd-4968-bc07-22ec399f693f
---

# Classification Hygiene Audit Checklist

## Active Layer Integrity

- [ ] Every markdown file in `docs/obsidian` has exactly one entry in `config/docs-corpus-classification.json`.
- [ ] No orphan paths remain in classification entries.
- [ ] `class`, `lifecycle`, `rag_status`, `source_of_truth_status`, `owner` match current governance truth.

## Stale Marker Cleanup

- [ ] `source_of_truth_status=missing` is absent for docs with defined `source_of_truth`.
- [ ] `weak_signal_reason=missing-source-of-truth` is absent for docs with resolved SoT.
- [ ] `action=assign-owner` is absent for docs where `owner` exists.

## Historical Trace Separation

- [ ] Closed remediation markers moved to `config/docs-corpus-remediation-history.json`.
- [ ] Active classification contains only active defects.
- [ ] Historical trace does not leak into default governance decisions.

## Cross-Policy Consistency

- [ ] Classification is consistent with owner policy.
- [ ] Classification is consistent with source-of-truth policy.
- [ ] Classification is consistent with lifecycle policy.
- [ ] Classification is consistent with canonical inventory and governance matrix.

## Validation Evidence

- [ ] `python -m tools.automation docs verify --root .`
- [ ] `python -m tools.automation docs governance-check --root . --mode main --output-format json`
- [ ] blocking findings for `classification-metadata-hygiene` gate are zero.
- [ ] stale marker counters are zero.
