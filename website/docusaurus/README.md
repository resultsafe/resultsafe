---
uuid: efa27dd9-d5e4-4b92-96e6-be6c718304ee
title: "Docusaurus Contour"
type: doc
status: active
kb_lifecycle: current
owner: "core-fp"
publication_layer: docusaurus
source_of_truth: projection
canonical_sources: [DOC-001, DOC-002, SPEC-016, POL-001]
derived_from_uuids: [91a60832-ae6a-4a99-a5ca-0f09814e2eb2, 22e0d13c-e58d-444c-883c-175ec34985a2, 53b0d36e-18e6-4580-a300-08f6a8f3d187, 32839dd0-3df5-4173-9bd8-0ac82dbbdd03]
created: 2026-03-23
updated: 2026-03-23
links: [DOC-001, DOC-002, SPEC-016, POL-001]
tags: [documentation, docusaurus, publication-layer]
---

# Docusaurus Contour

`/docs/docusaurus/` — curated docs portal проекта.

## Роль слоя

- пользовательский вход в документацию;
- навигационные карты по пакетам, API и сценариям;
- onboarding и обучающие walkthrough.

## Границы ответственности

- не является source-of-truth для runtime/API/governance;
- нормативные контракты фиксируются в `packages/*`, `README.md`, `docs/obsidian/*`;
- контур портала проецирует и агрегирует канонический контент.
- исключение возможно только через реестр `docs/obsidian/specs/identifier-registry/DOC-PORTAL-SOURCE-OVERRIDES.json`.

## Обязательные правила

- для каждой портал-страницы должны быть ссылки на canonical источники (`DOC/SPEC/ADR/README`, package README, API);
- запрещено хранить несогласованные нормативные требования, которых нет в канонических документах;
- markdown-страницы именуются в ASCII без пробелов, route-friendly `kebab-case`.
- для каждой markdown-страницы обязателен frontmatter с `canonical_sources` и `source_of_truth: projection|exception`.
- при `source_of_truth: exception` обязателен `source_override_id` из override-реестра.
