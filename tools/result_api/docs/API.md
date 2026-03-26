# Result API — контракт

## Формат ответа

- Успех: `{"ok": true, "value": <payload>}`
- Ошибка: `{"ok": false, "error": {"code": "<code>", "message": "<text>"}}`
- Exit code: `0` при `ok=true`, `1` при `ok=false`.
- stdout: одна строка JSON. stderr: только диагностика (например, stacktrace при `internal`).

## Коды ошибок

- `invalid_id` — пустой ID или ID с пробелами.
- `not_found` — ID не найден в хранилище.
- `internal` — непредвиденная ошибка обработки.

## Ввод (CLI)

```
python tools/result_api/interface/cli/result_tool.py --id <value>
```

## Примеры

Успех:
```
{"ok": true, "value": {"message": "hello from result_api", "id": "demo"}}
```

Не найдено:
```
{"ok": false, "error": {"code": "not_found", "message": "id 'unknown' not found"}}
```

Невалидный ID:
```
{"ok": false, "error": {"code": "invalid_id", "message": "invalid_id: id must be non-empty and without whitespace"}}
```

## Расширяемость

- Источник данных инкапсулирован в репозитории (`ResultRepository`); можно заменить без изменения контракта.
- Формат Ok/Err неизменен при смене backend'а.
