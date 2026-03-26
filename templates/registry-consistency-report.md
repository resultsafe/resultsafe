---
uuid: 299dd0bd-4bfb-49d2-acd8-dba4951cbb58
---

# Registry Consistency Report

- Generated at: {{generated_at}}
- Mode: {{mode}}
- Status: {{status}}
- Report owner: {{report_owner}}

## Summary

- Blocking failures: {{blocking_failures}}
- Warning findings: {{warning_failures}}
- Informational findings: {{informational_findings}}
- Score: {{score}}

## Duplicate IDs Summary

{{duplicate_ids_summary}}

## Unresolved Links Summary

{{unresolved_links_summary}}

## Unresolved Relations Summary

{{unresolved_relations_summary}}

## Missing Normative IDs

{{missing_normative_ids_summary}}

## Missing Canonical Docs For Critical Domains

{{missing_canonical_docs_for_critical_domains}}

## Missing Owner On Critical Docs And Supporting Roadmap Artifacts

{{missing_owner_on_critical_docs}}

## Missing Source Of Truth On Critical Docs

{{missing_source_of_truth_on_critical_docs}}

## Conflicting Source Of Truth Cases

{{conflicting_source_of_truth_cases}}

## Lifecycle Mismatch Summary

{{lifecycle_mismatch_summary}}

## RAG Contamination Summary

{{rag_contamination_summary}}

## Registry Drift Summary

{{registry_drift_summary}}

## Blocking Conditions

{{blocking_conditions}}

## Warning Conditions

{{warning_conditions}}

## Pre-release Gate Contract

- Authoritative workflow: `.github/workflows/docs-registry-release-check.yml`
- Required contexts:
  - `docs-registry-release-check / pre-release-registry-consistency-gate`
  - `docs-registry-release-check / release-eligibility`
- Rule: `no pass => no release`
