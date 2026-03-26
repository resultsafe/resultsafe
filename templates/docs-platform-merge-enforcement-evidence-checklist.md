---
uuid: da6fdb2e-6452-456d-b10e-331afc066fe4
---

# Docs Platform Merge Enforcement Evidence Checklist

## Metadata

- Date: {{date}}
- Auditor: {{auditor}}
- Repository: {{repository}}
- Branch scope: {{branch_scope}}
- Policy refs:
  - `config/docs-platform-required-checks.json`
  - `config/docs-platform-branch-protection-ruleset-spec.json`
  - `config/docs-platform-live-evidence-policy.json`
  - `config/docs-platform-live-reconciliation-rules.json`
  - `config/docs-platform-settings-snapshot-schema.json`
  - `config/docs-platform-enforcement-waivers.json`

## Required checks alignment

- [ ] Export platform required checks for `main`.
- [ ] Export platform required checks for `release/*` (if configured).
- [ ] Confirm required checks list exactly matches canonical list from policy.
- [ ] Confirm no required check context is missing.
- [ ] Confirm no deprecated check context remains required.

## Ruleset / branch protection alignment

- [ ] Pull request required for protected branches.
- [ ] Required status checks enabled and strict.
- [ ] Up-to-date branch required.
- [ ] Force push disabled.
- [ ] Branch deletion disabled.
- [ ] Direct push restricted.
- [ ] Conversation resolution required.
- [ ] Admin bypass disabled or waiver-governed.

## Hard blocking evidence

- [ ] Provide one PR URL where a required check fails and merge is blocked.
- [ ] Provide one PR URL where all required checks pass and merge is allowed.
- [ ] Attach workflow run URLs for both scenarios.
- [ ] Attach status check screenshot/API export proving platform blocking behavior.

## Artifact evidence

- [ ] Capture live snapshot:
  - `python -m tools.automation docs capture-platform-settings-snapshot --root . --repository OWNER/REPO --captured-by <owner> --token-env GITHUB_TOKEN --workflow-run-url <run-url> --failing-pr-example <blocked-pr-url> --passing-pr-example <pass-pr-url>`
- [ ] Commit settings snapshot JSON conforming to `config/docs-platform-settings-snapshot-schema.json`.
- [ ] Snapshot stored at `config/docs-platform-settings-snapshot.json`.
- [ ] Run reconciliation:
  - `python -m tools.automation docs platform-enforcement-evidence-check --root . --mode release --report-file dist/docs-governance/platform-enforcement/platform-live-evidence-release.json --markdown-file dist/docs-governance/platform-enforcement/platform-live-evidence-release.md --output-format json`
- [ ] Reconciliation report status is `pass`.
- [ ] Commit this checklist with concrete links.
- [ ] Record waiver entries (if any) in `config/docs-platform-enforcement-waivers.json`.
- [ ] Ensure each waiver has expiry and approver.
- [ ] If live evidence is still missing, register/update debt `TD-GOV-PLATFORM-EVIDENCE-001` in `config/docs-governance-debt-register.json`.

## Final assertion

- [ ] Platform enforcement state is `hard-blocking`.
- [ ] Merge path is not bypassable without auditable waiver.
- [ ] Evidence is sufficient for independent certification audit.
