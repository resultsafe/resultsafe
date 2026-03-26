---
uuid: 65198b99-86f9-4db6-ab86-6f0749167934
---

# Release Preflight Registry Consistency Evidence Checklist

## Required Status Contexts

- [ ] `docs-registry-release-check / pre-release-registry-consistency-gate` is `success`.
- [ ] `docs-registry-release-check / release-eligibility` is `success`.

## Required Artifacts

- [ ] `dist/docs-governance/release-preflight/registry-consistency-report-release.json`
- [ ] `dist/docs-governance/release-preflight/registry-consistency-report-release.md`
- [ ] `dist/docs-governance/release-preflight/registry-consistency-cli-release.json`
- [ ] `dist/docs-governance/release-preflight/release-preflight-summary-release.json`
- [ ] `dist/docs-governance/release-preflight/release-eligibility-release.json`

## Registry Consistency Required Sections

- [ ] duplicate IDs summary
- [ ] unresolved links summary
- [ ] unresolved relations summary
- [ ] missing normative IDs
- [ ] missing canonical docs for critical domains
- [ ] missing owner on critical docs
- [ ] missing source of truth on critical docs
- [ ] conflicting source of truth cases
- [ ] lifecycle mismatch summary
- [ ] RAG contamination summary
- [ ] registry drift summary

## Waiver Validation (only for `pass-with-warnings`)

- [ ] Waiver exists in `config/docs-release-governance-waivers.json`.
- [ ] Waiver `scope` is `release-preflight-registry-consistency`.
- [ ] Waiver `status` is `active` and not expired.
- [ ] Dual approval present (`approved_by`, `approved_by_secondary`) and approvers are distinct.
- [ ] `related_release` and `evidence_ref` are filled.

## Blocking Rules

- [ ] No blocking threshold breaches.
- [ ] Release is blocked if status is `fail`.
- [ ] Release is blocked if status is `pass-with-warnings` without valid active waiver.
- [ ] Release is blocked if any required artifact is missing.
- [ ] Release is blocked if required sections are incomplete.

## Audit Trail

- [ ] Evidence is attached to release record.
- [ ] Waiver (if used) is linked in release notes.
- [ ] Settings snapshot is captured against `config/docs-release-settings-snapshot-schema.json`.
- [ ] Live platform settings snapshot exists: `config/docs-platform-settings-snapshot.json`.
- [ ] Platform enforcement reconciliation report exists and is `pass`:
  - `dist/docs-governance/platform-enforcement/platform-live-evidence-release.json`
- [ ] If platform evidence is not yet `pass`, debt `TD-GOV-PLATFORM-EVIDENCE-001` remains `open` and release/certification note includes explicit caveat.
