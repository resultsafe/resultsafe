---
uuid: a0ed6f14-fb5a-4f55-8496-29866e92c2e6
---

# Live Platform Evidence Generation Procedure

## Scope

This procedure captures live GitHub branch protection / ruleset settings and proves required status-check hard blocking for documentation governance.

## Required Inputs

- Repository identifier: `OWNER/REPO`
- Access to repository settings and rulesets
- One of:
  - GitHub REST API token with rulesets/settings read scope
  - GitHub GraphQL token
  - GitHub CLI (`gh`) authenticated
  - Manual UI export with auditable screenshots

## Output Artifacts

- `config/docs-platform-settings-snapshot.json`
- `dist/docs-governance/platform-enforcement/platform-live-evidence-release.json`
- `dist/docs-governance/platform-enforcement/platform-live-evidence-release.md`

## Capture Steps

1. Capture live rulesets and create normalized snapshot (GitHub API mode):
```bash
python -m tools.automation docs capture-platform-settings-snapshot --root . --repository OWNER/REPO --captured-by YOUR_TEAM_OR_USER --token-env GITHUB_TOKEN --workflow-run-url https://github.com/OWNER/REPO/actions/runs/123456 --failing-pr-example https://github.com/OWNER/REPO/pull/100 --passing-pr-example https://github.com/OWNER/REPO/pull/101 --audit-notes "Live platform capture for certification"
```
2. Alternative offline mode (using pre-exported rulesets JSON):
```bash
python -m tools.automation docs capture-platform-settings-snapshot --root . --repository OWNER/REPO --captured-by YOUR_TEAM_OR_USER --raw-rulesets-file artifacts/platform-rulesets-live.json --workflow-run-url https://github.com/OWNER/REPO/actions/runs/123456 --failing-pr-example https://github.com/OWNER/REPO/pull/100 --passing-pr-example https://github.com/OWNER/REPO/pull/101 --audit-notes "Offline export capture"
```
3. Ensure snapshot matches schema:
   - `config/docs-platform-settings-snapshot-schema.json`
   - `config/docs-platform-settings-snapshot.json`
4. Run reconciliation check:
```bash
python -m tools.automation docs platform-enforcement-evidence-check --root . --mode release --report-file dist/docs-governance/platform-enforcement/platform-live-evidence-release.json --markdown-file dist/docs-governance/platform-enforcement/platform-live-evidence-release.md --output-format json
```
5. Ensure report status is `pass`.
6. Attach artifacts to release/certification evidence chain.

## Naming Convention

- Snapshot: `config/docs-platform-settings-snapshot.json`
- Raw rulesets export: `dist/docs-governance/platform-enforcement/raw/platform-rulesets-live-*.json`
- JSON report: `dist/docs-governance/platform-enforcement/platform-live-evidence-{mode}.json`
- Markdown report: `dist/docs-governance/platform-enforcement/platform-live-evidence-{mode}.md`

## Refresh Cadence

- Refresh snapshot at least every 14 days.
- Refresh immediately after branch protection/ruleset changes.
