# Documentation Architecture

**Version:** 2.0.0  
**Effective Date:** 2026-03-27  
**Author:** Denis Savasteev  
**Status:** Active

---

## 🎯 Overview

This document describes the documentation architecture for the ResultSafe monorepo.

**Key Principles:**

1. **Separation of Concerns:** Source files separate from generated artifacts
2. **Single Source of Truth:** Each piece of documentation has one source location
3. **Multi-Platform Output:** Generate for web, AI/RAG, PDF, etc.
4. **Multi-Language Support:** English and Russian from the start
5. **Automation:** Auto-generate as much as possible

---

## 📁 Directory Structure

### Root Level

```
resultsafe/
├── packages/              # Source code packages
├── docs/                  # Documentation source
├── artifacts/             # Generated artifacts
└── tools/                 # Build tools
```

### Documentation (`docs/`)

```
docs/
├── README.md              # Documentation guide
├── ROADMAP.md            # Development roadmap
├── ARCHITECTURE.md       # This file
│
├── source/               # Markdown source files
│   ├── introduction/     # Getting started
│   │   ├── 01-overview.md
│   │   ├── 02-installation.md
│   │   └── 03-quick-start.md
│   │
│   ├── guides/           # Usage guides
│   │   ├── index.md
│   │   └── basic-usage.md
│   │
│   ├── patterns/         # Real-world patterns
│   │   └── index.md
│   │
│   └── api/              # API reference (auto-generated)
│       └── core-fp-result/
│
├── i18n/                 # Internationalization (translations)
│   ├── en/              # English (default)
│   │   └── (mirrors source/)
│   │
│   └── ru/              # Russian
│       └── (translated files)
│
└── config/               # Configuration files
    ├── docusaurus.config.ts
    ├── sidebars.ts
    └── tsconfig.json
```

### Artifacts (`artifacts/`)

```
artifacts/
├── README.md             # Artifacts guide
│
├── platforms/            # Platform-specific builds
│   ├── web/
│   │   └── docusaurus/  # Docusaurus website
│   │       ├── src/     # Generated React components
│   │       ├── build/   # Production build
│   │       └── deploy/  # Deployment configuration
│   │
│   └── ai/
│       ├── notebooklm/  # Google NotebookLM
│       │   ├── sources/ # Markdown for import
│       │   ├── citations/ # Citation index
│       │   └── exports/ # Q&A exports
│       │
│       ├── cursor/      # Cursor IDE
│       │   └── context/ # AI context files
│       │
│       └── embeddings/  # Vector embeddings
│           ├── index/   # Vector index
│           └── metadata/ # Metadata
│
├── formats/              # Format-specific exports
│   ├── markdown/        # Markdown collection
│   ├── pdf/             # PDF documentation
│   ├── json/            # Structured data
│   └── epub/            # E-book format
│
└── cache/                # Build cache (gitignored)
    └── .gitkeep
```

---

## 🔄 Generation Flow

### 1. Source → Documentation

```
packages/**/*.ts          # TypeScript source
    ↓ (Typedoc)
docs/source/api/         # API documentation (auto-generated)
```

### 2. Documentation → Artifacts

```
docs/source/             # Markdown source
    ↓ (Process)
artifacts/platforms/     # Platform-specific output
    ├── web/docusaurus/ # Website
    └── ai/notebooklm/  # RAG sources
```

### 3. Examples → Documentation

```
packages/**/__examples__/ # Code examples
    ↓ (Extract)
docs/source/guides/      # Usage guides
    ↓ (Process)
artifacts/formats/       # Multiple formats
```

---

## 🛠️ Tools & Scripts

### Generation Tools

Located in `tools/artifacts/`:

```
tools/artifacts/
├── generate.ts           # Main generator
├── platforms/
│   ├── web/
│   │   └── docusaurus.ts # Docusaurus generator
│   └── ai/
│       ├── notebooklm.ts # NotebookLM generator
│       └── cursor.ts     # Cursor generator
└── formats/
    ├── markdown.ts       # Markdown exporter
    └── pdf.ts            # PDF exporter
```

### npm Scripts

```json
{
  "scripts": {
    "artifacts:generate": "tsx tools/artifacts/generate.ts",
    "artifacts:web:docusaurus": "tsx tools/artifacts/platforms/web/docusaurus.ts",
    "artifacts:ai:notebooklm": "tsx tools/artifacts/platforms/ai/notebooklm.ts",
    "artifacts:format:markdown": "tsx tools/artifacts/formats/markdown.ts"
  }
}
```

---

## 📊 Platform Details

### Docusaurus Website

**Input:** `docs/source/` + `docs/config/`  
**Output:** `artifacts/platforms/web/docusaurus/build/`  
**Deployment:** GitHub Pages

**Configuration:**

- `docusaurus.config.ts` - Main config
- `sidebars.ts` - Navigation
- Multi-language: EN/RU

### NotebookLM

**Input:** `docs/source/`  
**Output:** `artifacts/platforms/ai/notebooklm/sources/`

**Format:** Markdown files optimized for import  
**Features:**

- Citation index
- Q&A exports
- Semantic search ready

### Cursor IDE

**Input:** `docs/source/` + `packages/**/__examples__/`  
**Output:** `artifacts/platforms/ai/cursor/context/`

**Format:** Context files for AI assistance  
**Features:**

- API reference
- Code examples
- Usage patterns

---

## 🎯 Best Practices

### For Developers

1. **Edit source files only** in `docs/source/`
2. **Never edit** files in `artifacts/` manually
3. **Run generation** after changes:
   ```bash
   pnpm run artifacts:generate
   ```
4. **Commit source files** - artifacts are generated

### For AI Agents

1. **Read from** `docs/source/` for context
2. **Generate to** `artifacts/` for output
3. **Validate** with `pnpm run artifacts:validate`
4. **Use correct paths:**
   - Source: `docs/source/**/*.md`
   - Generated: `artifacts/**/*`

---

## 📈 Future Enhancements

### Planned

- [ ] Auto-translation pipeline
- [ ] Vector embeddings generation
- [ ] Interactive playground
- [ ] API changelog auto-generation
- [ ] Versioned documentation

### Under Consideration

- Multi-version docs (v0.1.x, v0.2.x)
- Interactive API explorer
- Code sandbox integration
- Video tutorials

---

**Last Updated:** 2026-03-27  
**Version:** 2.0.0  
**Maintainer:** Denis Savasteev  
**Next Review:** 2026-04-27
