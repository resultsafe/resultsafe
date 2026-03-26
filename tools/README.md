# Каталог `tools/`

Справочник по внутренним утилитам монорепозитория. Канонические правила для всех инструментов — в [STANDARDS.md](./STANDARDS.md).

## Реестр инструментов

| tool_code | tool_id          | tool_uuid                              | path                        | description                                                     | version | status  |
|-----------|------------------|----------------------------------------|-----------------------------|-----------------------------------------------------------------|---------|---------|
| 1         | result-api       | 4f6a5f8c-4a1b-4f1a-8b8b-9f6c0e9d5a21   | tools/result_api            | Rust-style Result API + CLI `result_tool.py`                    | 0.1.0   | active  |
| 2         | package-checker  | 9a3b7d9e-2c4f-4b60-9d3c-0f2b1a4e7c55   | tools/package_checker       | Проверка структуры пакета по `docs/RULES.md` и `DOC-010`        | 0.1.0   | active  |

При добавлении нового инструмента:
- назначьте `tool_code` (натуральное число), `tool_id` (kebab-case, неизменяемый) и `tool_uuid` (UUID v4);
- укажите путь, краткое описание, версию (семвер) и статус (`active`/`deprecated`);
- оформите документацию по [STANDARDS.md](./STANDARDS.md).
