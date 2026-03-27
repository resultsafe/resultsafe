# Artifacts Generation Rules

**Version:** 1.0.0  
**Effective Date:** 2026-03-27  
**Author:** Denis Savasteev  
**Audience:** Human developers + AI agents (Cursor, Copilot, etc.)

Rules and conventions for generating documentation artifacts from source code.

---

## ⚡ Quick Start for AI Agents

**When generating artifacts, ALWAYS:**

1. **Source First** — Generate from `packages/`, never edit `artifacts/` manually
2. **Validate Structure** — Follow the directory structure exactly
3. **Multi-Language Ready** — English primary, translations in `languages/`
4. **Platform Agnostic** — Generate once, deploy to many platforms
5. **Version Aware** — Include version in artifacts

**Quick Commands:**
```bash
# Generate all
pnpm run artifacts:generate

# Validate structure
pnpm run artifacts:validate

# Clean and regenerate
pnpm run artifacts:clean && pnpm run artifacts:generate
```

---

## 📁 Artifact Directory Structure

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

## 🎯 Core Principles

### 1. Source of Truth

```
✅ Source: packages/**/*.ts
✅ Generated: artifacts/**
❌ Never edit: artifacts/generated/**
```

**Rule:** All artifacts are generated from source. Never edit generated files.

### 2. Immutable Generated Files

```bash
# ❌ WRONG - Editing generated file
vim artifacts/generated/api/markdown/Result.md

# ✅ CORRECT - Edit source, regenerate
vim packages/core/fp/result/src/types/Result.ts
pnpm run artifacts:generate
```

### 3. Reproducible Builds

```bash
# Same source → same artifacts
pnpm run artifacts:clean
pnpm run artifacts:generate
# Output should be identical
```

### 4. Multi-Language Support

```
✅ Primary: English (en/)
✅ Translations: languages/<lang>/
✅ Source: English comments in code
```

### 5. Platform Agnostic

```
✅ Generate once: artifacts/formats/markdown/
✅ Deploy many: web/, ai/, package/, vcs/
```

### 6. Versioned

```
✅ Current: artifacts/versions/latest/
✅ Archive: artifacts/versions/0.2.x/
✅ Keep last N versions
```

### 7. Clean Structure

```bash
# artifacts/ can be deleted and regenerated
rm -rf artifacts/
pnpm run artifacts:generate
# Everything restored from source
```

---

## 📋 Validation Rules

### Structure Validation

```bash
pnpm run artifacts:validate
```

**Checks:**
- [ ] All required directories exist
- [ ] No manual edits in `generated/`
- [ ] Language structure consistent
- [ ] Platform configs valid
- [ ] Version symlinks correct

### Content Validation

**For each artifact:**
- [ ] Generated from current source
- [ ] Links are valid
- [ ] Code snippets compile
- [ ] Multi-language consistent
- [ ] Version tags correct

---

## 🔄 Generation Workflow

### Full Generation

```bash
# 1. Clean
pnpm run artifacts:clean

# 2. Generate all
pnpm run artifacts:generate

# 3. Validate
pnpm run artifacts:validate

# 4. Test (optional)
pnpm run artifacts:test
```

### Platform-Specific

```bash
# Web (Docusaurus)
pnpm run artifacts:web:docusaurus

# AI (NotebookLM)
pnpm run artifacts:ai:notebooklm

# Package (npm)
pnpm run artifacts:package:npm
```

### Language-Specific

```bash
# English
pnpm run artifacts:lang:en

# Russian
pnpm run artifacts:lang:ru

# All
pnpm run artifacts:lang:all
```

---

## 🌐 Multi-Language Rules

### Source Structure

```
packages/core/fp/result/__examples__/
├── 00-quick-start/
│   └── 001-hello-world/
│       ├── example.ts        # Source (English comments)
│       └── example.ru.ts     # Russian translation (optional)
│
├── README.md                  # English (primary)
└── README.ru.md              # Russian translation
```

### Generated Structure

```
artifacts/languages/
├── en/
│   ├── api/                  # API docs (English)
│   ├── guides/               # Guides (English)
│   └── examples/             # Examples (English)
│
└── ru/
    ├── api/                  # API docs (Russian)
    ├── guides/               # Guides (Russian)
    └── examples/             # Examples (Russian)
```

### Translation Workflow

1. **Source:** English (primary)
2. **Translate:** Manual or AI-assisted
3. **Validate:** Check links, code snippets
4. **Generate:** Platform-specific builds

---

## ⚙️ Configuration

### Main Config

```typescript
// tools/artifacts/config/index.ts
export const artifactConfig = {
  sourceDir: 'packages',
  outputDir: 'artifacts',
  
  platforms: {
    web: ['docusaurus', 'vitepress'],
    ai: ['notebooklm', 'cursor', 'copilot'],
    package: ['npm', 'jsr'],
  },
  
  languages: ['en', 'ru'],
  defaultLanguage: 'en',
  
  formats: ['markdown', 'json', 'pdf', 'epub'],
  
  versions: {
    keepLastN: 5,
    archiveOld: true,
  },
};
```

### Platform Config

```typescript
// tools/artifacts/config/docusaurus.config.ts
export const docusaurusConfig = {
  title: 'ResultSafe',
  tagline: 'Functional Result type for TypeScript',
  url: 'https://resultsafe.github.io',
  baseUrl: '/resultsafe/',
  organizationName: 'resultsafe',
  projectName: 'resultsafe',
};
```

---

## 📊 For AI Agents: Generation Rules

### When Generating Artifacts

**DO:**
- ✅ Generate from `packages/` source
- ✅ Follow directory structure exactly
- ✅ Include version metadata
- ✅ Validate after generation
- ✅ Keep English as primary
- ✅ Use consistent naming

**DON'T:**
- ❌ Edit files in `artifacts/generated/`
- ❌ Skip validation
- ❌ Mix languages in same directory
- ❌ Hardcode platform paths
- ❌ Forget version tags

### Validation Checklist

**Before committing artifacts:**

```bash
# 1. Structure check
pnpm run artifacts:validate

# 2. Content check
pnpm run artifacts:check:links
pnpm run artifacts:check:snippets

# 3. Build test
pnpm run artifacts:web:docusaurus

# 4. Clean test
pnpm run artifacts:clean
pnpm run artifacts:generate
# Should be identical
```

---

## 🛠️ Extending the System

### Adding New Platform

1. **Create directory:**
   ```
   artifacts/platforms/<category>/<platform-name>/
   ```

2. **Add generator:**
   ```typescript
   // tools/artifacts/generators/<platform-name>.ts
   export async function generatePlatformName() {
     // Generation logic
   }
   ```

3. **Add config:**
   ```typescript
   // tools/artifacts/config/<platform-name>.config.ts
   export const config = { /* ... */ };
   ```

4. **Add npm script:**
   ```json
   {
     "scripts": {
       "artifacts:<category>:<platform-name>": "tsx tools/artifacts/generators/<platform-name>.ts"
     }
   }
   ```

5. **Update main generator:**
   ```typescript
   // tools/artifacts/generate.ts
   import { generatePlatformName } from './generators/<platform-name>';
   ```

### Adding New Language

1. **Create directory:**
   ```
   artifacts/languages/<lang-code>/
   ```

2. **Add translation config:**
   ```typescript
   // tools/i18n/<lang-code>.ts
   export const langConfig = { /* ... */ };
   ```

3. **Add to generator:**
   ```typescript
   // tools/artifacts/languages.ts
   export const supportedLanguages = ['en', 'ru', '<lang-code>'];
   ```

4. **Add npm script:**
   ```json
   {
     "scripts": {
       "artifacts:lang:<lang-code>": "tsx tools/artifacts/languages.ts --lang <lang-code>"
     }
   }
   ```

### Adding New Format

1. **Create directory:**
   ```
   artifacts/formats/<format-name>/
   ```

2. **Add transformer:**
   ```typescript
   // tools/artifacts/transformers/<format-name>.ts
   export async function transformToFormatName() {
     // Transformation logic
   }
   ```

3. **Register in main generator**

---

## 📈 Metrics

### Track These

| Metric | Command | Target |
|--------|---------|--------|
| Generation time | `pnpm run artifacts:generate --timing` | < 2 min |
| Artifact size | `du -sh artifacts/` | < 100 MB |
| Language coverage | `pnpm run artifacts:lang:status` | en: 100%, ru: 80%+ |
| Platform builds | `pnpm run artifacts:status` | All green |

---

## 🔧 npm Scripts

```json
{
  "scripts": {
    "artifacts:generate": "tsx tools/artifacts/generate.ts",
    "artifacts:clean": "rimraf artifacts/generated artifacts/platforms artifacts/languages artifacts/formats artifacts/versions",
    "artifacts:validate": "tsx tools/artifacts/validate.ts",
    "artifacts:watch": "tsx tools/artifacts/watch.ts",
    
    "artifacts:web:docusaurus": "tsx tools/artifacts/platforms/web/docusaurus.ts",
    "artifacts:web:vitepress": "tsx tools/artifacts/platforms/web/vitepress.ts",
    "artifacts:ai:notebooklm": "tsx tools/artifacts/platforms/ai/notebooklm.ts",
    "artifacts:ai:cursor": "tsx tools/artifacts/platforms/ai/cursor.ts",
    "artifacts:package:npm": "tsx tools/artifacts/platforms/package/npm.ts",
    
    "artifacts:lang:en": "tsx tools/artifacts/languages.ts --lang en",
    "artifacts:lang:ru": "tsx tools/artifacts/languages.ts --lang ru",
    "artifacts:lang:all": "tsx tools/artifacts/languages.ts --all",
    
    "artifacts:format:markdown": "tsx tools/artifacts/formats/markdown.ts",
    "artifacts:format:json": "tsx tools/artifacts/formats/json.ts",
    "artifacts:format:pdf": "tsx tools/artifacts/formats/pdf.ts",
    
    "artifacts:version:current": "tsx tools/artifacts/versions.ts --current",
    "artifacts:version:archive": "tsx tools/artifacts/versions.ts --archive"
  }
}
```

---

## ✅ Checklist for AI Agents

**Before submitting artifact changes:**

- [ ] Generated from source (`packages/`)
- [ ] Structure validated (`pnpm run artifacts:validate`)
- [ ] No manual edits in `generated/`
- [ ] Multi-language consistent
- [ ] Version tags correct
- [ ] Platform builds work
- [ ] Clean test passed (delete & regenerate)

**If all checks pass → Ready to commit!**

---

## 📚 Related Documents

- [TypeScript Validation Rules](./TYPESCRIPT_VALIDATION_RULES.md) — Example validation
- [AI JSDOC Standard](./AI_JSDOC_STANDARD.md) — Documentation standard
- [Validation Guide](./VALIDATION_GUIDE.md) — Full validation pipeline

---

**Last Updated:** 2026-03-27  
**Version:** 1.0.0  
**Maintainer:** Denis Savasteev  
**Audience:** Human developers + AI agents
