# Проверка структуры пакета

Инструмент для валидации структуры пакета по каноническим правилам из `docs/RULES.md` и `docs/specs/DOC-010-package-and-publishing-structure-canonical-rule.md`.

## Запуск
```bash
python tools/package_checker/check_package_structure.py --root packages/core/fp/result
```
Где `--root` — путь к корню проверяемого пакета (директория с `package.json`).

## Правила, которые проверяются
- Обязательные файлы: `package.json`, `CHANGELOG.md`, `CONTRIBUTING.md`, `README.md`.
- Обязательные каталоги: `src`, `__examples__`, `__tests__`, `docs`.
- Структура `__examples__`: `basic/`, `advanced/`, `domains/` с подпапками `auth/`, `payments/`, `validation/`.
- Структура `docs/`: наличие `_category_.json`, `index.md`, `api.md`, `changelog.md`, разделов `api/`, `migration/`, `examples/` с доменными файлами.
- `README.ru.md` считается опциональным (не ошибка, если отсутствует).
- Дополнительно: проверка глубины вложенности (по умолчанию не более 6 уровней) и типов файлов в `docs/` — допускаются только `.md` и `.json` (и `_category_.json`).

## Результат
- Код выхода `0`, если структура соответствует стандарту.
- Код выхода `1`, если найдены нарушения; список отсутствующих элементов выводится в stderr.

## Требования
- Python 3.11+
- Зависимости: только стандартная библиотека.
