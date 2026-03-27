# Artifacts Directory

**Purpose:** Generated documentation and deployment artifacts from source code.

**Scalable Structure:** Supports multiple output formats, languages, and platforms.

---

## 📁 Directory Structure

```
artifacts/
├── README.md                    # This file
├── .gitkeep                     # Keep directory in git
│
├── generated/                   # Auto-generated content (DO NOT EDIT)
│   ├── api/                    # API documentation
│   │   ├── json/              # Typedoc JSON output
│   │   ├── markdown/          # Markdown for processing
│   │   └── html/              # Static HTML site
│   │
│   ├── examples/              # Compiled examples
│   │   ├── executable/        # Runnable code snippets
│   │   ├── notebooks/         # Jupyter/Colab notebooks
│   │   └── playground/        # Interactive TypeScript playground
│   │
│   └── analysis/              # Code analysis
│       ├── coverage/          # Test coverage reports
│       ├── bundle/            # Bundle size analysis
│       └── metrics/           # Code metrics
│
├── platforms/                  # Platform-specific builds
│   ├── web/                   # Web documentation sites
│   │   ├── docusaurus/       # Docusaurus v2/v3
│   │   ├── vitepress/        # VitePress
│   │   ├── astro/            # Astro Starlight
│   │   └── nextjs/           # Next.js custom
│   │
│   ├── ai/                    # AI-powered platforms
│   │   ├── notebooklm/       # Google NotebookLM sources
│   │   ├── cursor/           # Cursor IDE context
│   │   ├── copilot/          # GitHub Copilot context
│   │   └── embeddings/       # Vector embeddings for RAG
│   │
│   ├── package/              # Package registries
│   │   ├── npm/             # npmjs.com
│   │   ├── pypi/            # PyPI (if Python bindings)
│   │   └── jsr/             # JSR (Deno)
│   │
│   ├── vcs/                 # Version control systems
│   │   ├── github/          # GitHub Wiki, Pages
│   │   ├── gitlab/          # GitLab Pages
│   │   └── bitbucket/       # Bitbucket Wiki
│   │
│   └── docs/                # Documentation hubs
│       ├── readthedocs/     # ReadTheDocs
│       ├── gitbook/         # GitBook
│       └── notion/          # Notion workspace
│
├── languages/                 # Language-specific exports
│   ├── en/                   # English (primary)
│   │   ├── api/
│   │   ├── guides/
│   │   └── examples/
│   │
│   ├── ru/                   # Russian
│   │   ├── api/
│   │   ├── guides/
│   │   └── examples/
│   │
│   └── <lang>/               # Future languages
│       ├── api/
│       ├── guides/
│       └── examples/
│
├── formats/                   # Format-specific exports
│   ├── markdown/             # Markdown collection
│   │   ├── minimal/         # Clean markdown
│   │   ├── github/          # GitHub-flavored
│   │   └── obsidian/        # Obsidian vault
│   │
│   ├── pdf/                  # PDF documentation
│   │   ├── api/
│   │   ├── guides/
│   │   └── complete/
│   │
│   ├── epub/                 # E-book format
│   │   ├── api/
│   │   └── guides/
│   │
│   ├── json/                 # Structured data
│   │   ├── api/
│   │   ├── examples/
│   │   └── search-index/
│   │
│   └── xml/                  # XML feeds
│       ├── sitemap/
│       └── rss/
│
├── versions/                  # Versioned archives
│   ├── latest/               # Current version (symlink)
│   ├── 0.1.x/               # Patch versions
│   ├── 0.2.x/
│   └── ...
│
└── cache/                     # Build cache (gitignored)
    ├── .gitkeep
    └── (temporary files)
```

---

## 🚀 Quick Start

```bash
# Generate all artifacts
pnpm run artifacts:generate

# Validate structure
pnpm run artifacts:validate

# Clean and regenerate
pnpm run artifacts:clean && pnpm run artifacts:generate
```

---

## 📚 Documentation

| Document                                                                                                | Description                             |
| ------------------------------------------------------------------------------------------------------- | --------------------------------------- |
| [ARTIFACTS_RULES.md](./packages/core/fp/result/__examples__/ARTIFACTS_RULES.md)                         | Complete rules for artifacts generation |
| [TYPESCRIPT_VALIDATION_RULES.md](./packages/core/fp/result/__examples__/TYPESCRIPT_VALIDATION_RULES.md) | TypeScript validation for examples      |
| [AI_JSDOC_STANDARD.md](./packages/core/fp/result/__examples__/AI_JSDOC_STANDARD.md)                     | JSDoc annotation standard               |

---

## 🎯 Principles

1. **Source of Truth:** Code in `packages/`, artifacts in `artifacts/`
2. **Immutable:** Never edit generated files manually
3. **Reproducible:** Same source → same artifacts
4. **Versioned:** Artifacts follow package version
5. **Multi-Language:** English primary, translations in `languages/`
6. **Platform-Agnostic:** Generate once, deploy anywhere
7. **Extensible:** Easy to add new platforms/languages/formats

---

**Last Updated:** 2026-03-27  
**Version:** 1.0.0  
**Maintainer:** Denis Savasteev
