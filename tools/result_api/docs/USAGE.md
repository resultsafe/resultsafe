# Использование Result API CLI

## Требования
- Python 3.11+
- Зависимости: только стандартная библиотека.

## Запуск
```
python tools/result_api/interface/cli/result_tool.py --id demo
```

## Правила интеграции для агента
1. Вызывать CLI с параметром `--id`.
2. Разбирать stdout как JSON.
3. Ветвление по полю `ok`:
   - `ok=true` → брать `value`.
   - `ok=false` → использовать `error.code`/`error.message`.
4. Exit code: 0 на успех, 1 на ошибку.
5. stderr не парсить (там только диагностика).

## Подмена источника данных
Реализация хранилища находится в `tools/result_api/infrastructure/repositories.py`.
Можно заменить на файл/БД/HTTP, оставив контракт Ok/Err без изменений.
