---
uuid: 48746008-e105-4be6-bfc6-2fe2ab639cdf
---

# Platform Evidence Validation Checklist

- [ ] Snapshot captured via automation command:
  - `python -m tools.automation docs capture-platform-settings-snapshot --root . --repository OWNER/REPO --captured-by <owner> ...`
- [ ] `config/docs-platform-settings-snapshot.json` exists and is current.
- [ ] Snapshot conforms to `config/docs-platform-settings-snapshot-schema.json`.
- [ ] Snapshot source is live (`github-rest-api` / `github-graph-api` / `gh-cli-export` / `manual-ui-export`).
- [ ] Snapshot contains no placeholders (`OWNER/REPO`, `EXAMPLE`, `TODO`).
- [ ] `required checks` for merge contexts are present in snapshot.
- [ ] `release required checks` are present in snapshot and enforced on `release/*` or `refs/tags/v*`.
- [ ] Rulesets are `enforcement=active`.
- [ ] `strict_status_checks=true`.
- [ ] `allow_force_pushes=false`.
- [ ] `restrict_direct_pushes=true`.
- [ ] `admin_bypass_allowed=false` (or waiver recorded).
- [ ] Reconciliation report generated:
  - `dist/docs-governance/platform-enforcement/platform-live-evidence-release.json`
  - `dist/docs-governance/platform-enforcement/platform-live-evidence-release.md`
- [ ] Report status is `pass`.
- [ ] Evidence links exist:
  - settings export file(s)
  - failing PR URL (blocked merge)
  - passing PR URL (allowed merge)
- [ ] If any item above is not satisfied, debt `TD-GOV-PLATFORM-EVIDENCE-001` is marked `open` in `config/docs-governance-debt-register.json`.
