Запрос к ИИ: сформируй полный, проверяемый список правил для скрипта `check_package_structure.py`, основываясь на канонических стандартах документации (docs/RULES.md, DOC-010), чтобы агент мог валидировать структуру любого пакета.

Требования к ответу ИИ:
1) Дай плоский перечень обязательных сущностей с путями относительно корня пакета:
   - Файлы: package.json, CHANGELOG.md, CONTRIBUTING.md, README.md.
   - Директории: src/, __examples__/, __tests__/, docs/.
   - __examples__/ must contain: basic/, advanced/, domains/, domains/auth/, domains/payments/, domains/validation/.
   - docs/ must contain:
     * _category_.json, index.md, api.md, changelog.md
     * api/: _category_.json, index.md, ok.md, err.md, result.md
     * migration/: _category_.json, index.md, v1-to-v2.md
     * examples/: _category_.json, index.md, basic.md, advanced.md
     * examples/domains/: _category_.json, index.md, auth.md, payments.md, validation.md
2) Укажи, что README.ru.md опционален (отсутствие не ошибка).
3) Ограничение глубины: вложенность путей не более 6 уровней от корня пакета.
4) Ограничение типов файлов в docs/: разрешены только .md и .json (включая _category_.json).
5) Ошибки классифицируй как “missing required item” или “unsupported file type” или “excessive depth”.
6) Не добавляй ничего, что выходит за рамки файловой структуры (никаких зависимостей или кода).
7) Ответом должен быть список правил/проверок в явном виде, пригодном для сопоставления со структурой пакета.
