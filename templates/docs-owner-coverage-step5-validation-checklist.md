---
uuid: 4b02f423-f1a2-444d-982d-59986c21de4c
---

# Step 5 Owner Coverage Validation Checklist

- [ ] `python -m tools.automation docs verify --root . --output-format json` returns `status=ok`.
- [ ] `python -m tools.automation docs governance-check --root . --mode main --output-format json` returns `blocking_failures=0`.
- [ ] `python -m tools.automation docs rag-governance-check --root . --mode main --report-file dist/docs-governance/rag-step5-main.json --markdown-file dist/docs-governance/rag-step5-main.md --output-format json` returns `status=ok`.
- [ ] `python -m tools.automation docs registry-consistency-report --root . --mode release --report-file dist/docs-governance/release-preflight/registry-consistency-step5.json --markdown-file dist/docs-governance/release-preflight/registry-consistency-step5.md --output-format json` returns `status=ok`.
- [ ] `missing_owner_on_critical_docs.missing_owner_critical_docs_count == 0`.
- [ ] `missing_owner_on_critical_docs.missing_owner_supporting_roadmap_docs_count == 0`.
- [ ] `missing_owner_on_critical_docs.supporting_roadmap_source_of_truth_status_mismatch_count == 0`.
- [ ] `missing_owner_on_critical_docs.supporting_roadmap_rag_status_mismatch_count == 0`.
- [ ] merge workflow context `owner-completeness-enforcement` remains green on PR.
