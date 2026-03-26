---
uuid: af4998fe-3c01-4733-b695-6f283979a110
---

# 🎯 VSCode Exclude Toggle

**Утилита для управления `files.exclude` и `search.exclude` в VS Code через YAML/JSON.**

Позволяет:

- 🔹 Интерактивно включать/выключать отдельные паттерны
- ⚡ Быстро переключать последний выбранный паттерн
- 🔄 Переключать все `files.exclude` одним нажатием

---

## 📂 Структура проекта

```c
vs-code-exclude-toggle/
├─ exclude-patterns.yaml      # YAML с паттернами
├─ package.json
├─ src/
│  ├─ config.js
│  ├─ demo-toggle.js
│  ├─ fast-toggle.js
│  ├─ toggle-exclude.js
│  ├─ toggle-files-exclude.js
│  └─ utils/
│      ├─ io.js
│      ├─ json.js
│      └─ yaml-loader.js
```

---

## ⚙️ Установка

`pnpm install yaml`

В `package.json`:

`{   "type": "module" }`

---

## 📝 Пример `exclude-patterns.yaml`

`files.exclude:   "**/node_modules": true   "**/.env": false   "**/dist": true  search.exclude:   "**/dist": true   "**/*.min.js": false`

---

## 🚀 Команды и примеры использования

| Команда                      | Описание                                                  | Пример                                                    |
| ---------------------------- | --------------------------------------------------------- | --------------------------------------------------------- |
| 🔹 Интерактивный выбор       | Меню с паттернами для выбора и переключения               | `node src/demo-toggle.js exclude-patterns.yaml`           |
| ⚡ Fast Toggle               | Переключение последнего выбранного паттерна одним Enter   | `node src/fast-toggle.js exclude-patterns.yaml`           |
| 🔄 Toggle всех files.exclude | Переключает все паттерны `files.exclude` между true/false | `node src/toggle-files-exclude.js exclude-patterns.yaml`  |
| 📊 Статус                    | Отображение текущего состояния всех паттернов             | `node src/toggle-exclude.js exclude-patterns.yaml status` |

---

## 💡 Примечания

- Кэш последнего выбора хранится в `src/.exclude-cache.json`
- Если YAML не найден или пустой — используется пустой набор паттернов
- Скрипты полностью ESM, поддерживают Windows и Linux
- Поддерживается любое имя YAML-файла, передаваемое первым аргументом

---

## 🎨 Примеры вывода в консоли

### Интерактивный выбор

`🎯 VS Code Exclude Patterns Toggle    1. [files.exclude] **/node_modules - EXCLUDED   2. [files.exclude] **/.env - INCLUDED   3. [search.exclude] **/dist - EXCLUDED ──────────────────────────────────────────────  Выберите паттерн (1-3) или q для выхода: 2 ✓ [files.exclude] **/.env → EXCLUDED`

### Fast Toggle

`⚠ Последний выбор: [files.exclude] **/.env ℹ Текущее состояние: INCLUDED  Нажмите ENTER для переключения:  ✓ [files.exclude] **/.env → EXCLUDED`

### Toggle всех files.exclude

`✓ Все паттерны files.exclude → EXCLUDED`

### Статус

`🎯 Текущее состояние паттернов  [files.exclude]   **/node_modules - EXCLUDED   **/.env - INCLUDED   **/dist - EXCLUDED  [search.exclude]   **/dist - EXCLUDED   **/*.min.js - INCLUDED`
