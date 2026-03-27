# Documentation Source

**Purpose:** Source documentation files (Markdown) for the ResultSafe project.

**DO NOT EDIT GENERATED FILES:** All files in `artifacts/` are auto-generated.

---

## 📁 Structure

```
docs/
├── README.md               # This file
├── ROADMAP.md             # Documentation roadmap
│
├── source/                 # Markdown source files
│   ├── introduction/      # Getting started
│   │   ├── 01-overview.md
│   │   ├── 02-installation.md
│   │   └── 03-quick-start.md
│   │
│   ├── guides/            # Usage guides
│   │   ├── index.md
│   │   └── basic-usage.md
│   │
│   ├── patterns/          # Real-world patterns
│   │   └── index.md
│   │
│   └── api/               # API reference (auto-generated)
│       └── core-fp-result/
│
├── translations/           # Translations
│   ├── en/                # English (default)
│   │   └── (copy of source/)
│   │
│   └── ru/                # Russian
│       └── (translated files)
│
└── config/                 # Configuration (not build output)
    ├── docusaurus.config.ts
    ├── sidebars.ts
    └── tsconfig.json
```

---

## 🔄 Generation Flow

```
packages/                    # Source code
    └── __examples__/       # Code examples
         ↓ (extracted)
docs/source/                # Documentation source
    └── api/               # Auto-generated API docs
         ↓ (processed)
artifacts/platforms/        # Generated artifacts
    ├── web/docusaurus/    # Website
    └── ai/notebooklm/     # RAG sources
```

---

## 📝 For AI Agents

**When editing documentation:**

1. **Edit source files** in `docs/source/`
2. **NEVER edit** files in `artifacts/` manually
3. **Run generation** to update artifacts:
   ```bash
   pnpm run artifacts:generate
   ```

**Source of truth:**
- Code examples: `packages/**/__examples__/`
- Documentation: `docs/source/`
- Generated output: `artifacts/`

---

## 🚀 Commands

```bash
# Generate all artifacts
pnpm run artifacts:generate

# Generate Docusaurus site
pnpm run artifacts:web:docusaurus

# Generate NotebookLM sources
pnpm run artifacts:ai:notebooklm

# Validate documentation
pnpm run docs:validate
```

---

**Last Updated:** 2026-03-27  
**Version:** 2.0.0  
**Maintainer:** Denis Savasteev
