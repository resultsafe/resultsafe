# Artifacts

**Purpose:** Generated documentation and deployment artifacts.

**⚠️ DO NOT EDIT:** All files here are auto-generated from source.

---

## 📁 Structure

```
artifacts/
├── README.md               # This file
│
├── platforms/              # Platform-specific builds
│   ├── web/               # Web documentation sites
│   │   └── docusaurus/   # Docusaurus site
│   │       ├── src/      # Generated React components
│   │       ├── build/    # Production build
│   │       └── deploy/   # Deployment config
│   │
│   └── ai/                # AI/RAG platforms
│       ├── notebooklm/   # Google NotebookLM
│       │   ├── sources/  # Markdown for import
│       │   ├── citations/ # Citation index
│       │   └── exports/  # Q&A exports
│       │
│       ├── cursor/       # Cursor IDE
│       │   └── context/  # AI context files
│       │
│       └── embeddings/   # Vector embeddings
│           ├── index/    # Vector index
│           └── metadata/ # Metadata
│
├── formats/                # Format-specific exports
│   ├── markdown/
│   ├── pdf/
│   ├── json/
│   └── epub/
│
└── cache/                  # Build cache (gitignored)
    └── .gitkeep
```

---

## 🚀 Generation

### All Artifacts

```bash
pnpm run artifacts:generate
```

### Platform-Specific

```bash
# Docusaurus website
pnpm run artifacts:web:docusaurus

# NotebookLM sources
pnpm run artifacts:ai:notebooklm

# Cursor context
pnpm run artifacts:ai:cursor
```

### Format-Specific

```bash
# Markdown export
pnpm run artifacts:format:markdown

# PDF export
pnpm run artifacts:format:pdf
```

---

## 📋 For AI Agents

**Rules:**

1. **NEVER edit** files in `artifacts/` manually
2. **Always generate** from source:
   ```bash
   pnpm run artifacts:generate
   ```
3. **Source files** are in:
   - `docs/source/` - Documentation
   - `packages/**/__examples__/` - Code examples

**Generation pipeline:**

```
Source → Process → Generate → Artifacts
```

---

## 🔄 CI/CD Integration

### GitHub Actions

```yaml
# .github/workflows/artifacts.yml
name: Generate Artifacts

on:
  push:
    branches: [main]

jobs:
  generate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Generate Artifacts
        run: pnpm run artifacts:generate

      - name: Deploy Website
        uses: peaceiris/actions-gh-pages@v4
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./artifacts/platforms/web/docusaurus/build
```

---

## 📊 Current Status

| Platform   | Status     | Output                                |
| ---------- | ---------- | ------------------------------------- |
| Docusaurus | 🔄 Setup   | `artifacts/platforms/web/docusaurus/` |
| NotebookLM | ⏳ Planned | `artifacts/platforms/ai/notebooklm/`  |
| Cursor     | ⏳ Planned | `artifacts/platforms/ai/cursor/`      |
| Embeddings | ⏳ Planned | `artifacts/platforms/ai/embeddings/`  |

---

## 🎯 Principles

1. **Immutable:** Never edit generated files
2. **Reproducible:** Same source → same artifacts
3. **Versioned:** Follows package version
4. **Clean:** Can delete and regenerate anytime

---

**Last Updated:** 2026-03-27  
**Version:** 2.0.0  
**Maintainer:** Denis Savasteev
