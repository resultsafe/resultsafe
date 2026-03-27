# Docusaurus Integration Plan

**Version:** 1.0.1  
**Effective Date:** 2026-03-27  
**Author:** Denis Savasteev  
**Status:** Active

Step-by-step plan for integrating Docusaurus documentation site into the monorepo root.

---

## 📋 Quick Links

| Document                   | Description                                             |
| -------------------------- | ------------------------------------------------------- |
| [ROADMAP.md](./ROADMAP.md) | **Start here!** Step-by-step implementation checklist   |
| [README.md](./README.md)   | This file - full implementation plan with code examples |

**👉 For implementation, follow [ROADMAP.md](./ROADMAP.md)**

---

## 🎯 Goal

Create a unified documentation website using Docusaurus that:

- Aggregates documentation from all packages
- Supports multi-language (English + Russian)
- Follows Docusaurus best practices
- Scales to multiple packages
- Auto-generates from source code

---

## 📁 Target Structure

```
resultsafe/
├── packages/                    # Source packages
│   ├── core/
│   │   └── fp/
│   │       └── result/        # @resultsafe/core-fp-result
│   │           ├── src/
│   │           ├── __examples__/
│   │           └── docs/
│   └── playground/
│
├── docs/                        # Docusaurus site (NEW)
│   ├── README.md               # This file
│   ├── package.json            # Docusaurus dependencies
│   ├── docusaurus.config.ts    # Main config
│   ├── sidebars.ts             # Navigation structure
│   │
│   ├── src/                    # Source files
│   │   ├── pages/             # Custom pages
│   │   │   ├── index.tsx      # Home page
│   │   │   └── ...
│   │   └── components/        # React components
│   │
│   ├── docs/                   # Documentation
│   │   ├── introduction/      # Introduction section
│   │   │   ├── _category_.json
│   │   │   ├── 01-overview.md
│   │   │   └── ...
│   │   │
│   │   ├── packages/          # Package docs
│   │   │   ├── _category_.json
│   │   │   ├── core-fp-result/
│   │   │   │   ├── _category_.json
│   │   │   │   ├── index.md
│   │   │   │   ├── api/
│   │   │   │   └── examples/
│   │   │   └── ...            # Future packages
│   │   │
│   │   ├── guides/            # User guides
│   │   │   ├── _category_.json
│   │   │   ├── getting-started.md
│   │   │   └── ...
│   │   │
│   │   └── patterns/          # Patterns
│   │       ├── _category_.json
│   │       └── ...
│   │
│   ├── i18n/                   # Internationalization
│   │   ├── en/                # English (default)
│   │   │   ├── docusaurus-plugin-content-docs/
│   │   │   │   ├── current/
│   │   │   │   └── ...
│   │   │   └── docusaurus-theme-classic/
│   │   │       └── navbar.json
│   │   │
│   │   └── ru/                # Russian
│   │       ├── docusaurus-plugin-content-docs/
│   │       └── docusaurus-theme-classic/
│   │
│   ├── static/                 # Static assets
│   │   ├── img/               # Images
│   │   │   ├── logo.svg
│   │   │   └── favicon.ico
│   │   └── robots.txt
│   │
│   └── build/                  # Production build (gitignored)
│       └── ...
│
├── artifacts/                  # Generated artifacts
│   └── platforms/
│       └── web/
│           └── docusaurus/    # Symlink or copy to docs/
│
└── tools/
    └── artifacts/
        └── platforms/
            └── web/
                └── docusaurus.ts  # Generator script
```

---

## 📋 Implementation Phases

### Phase 1: Setup & Configuration (Week 1)

**Goal:** Basic Docusaurus site with single package docs

#### Step 1.1: Initialize Docusaurus

```bash
# From project root
cd docs
npx create-docusaurus@latest . classic --typescript
```

**Dependencies to add:**

```json
{
  "dependencies": {
    "@docusaurus/core": "^3.0.0",
    "@docusaurus/preset-classic": "^3.0.0",
    "@docusaurus/plugin-content-docs": "^3.0.0",
    "@mdx-js/react": "^3.0.0",
    "react": "^18.0.0",
    "react-dom": "^18.0.0"
  },
  "devDependencies": {
    "@docusaurus/module-type-aliases": "^3.0.0",
    "@docusaurus/tsconfig": "^3.0.0",
    "@types/react": "^18.0.0",
    "typescript": "^5.0.0"
  }
}
```

#### Step 1.2: Configure docusaurus.config.ts

```typescript
// docs/docusaurus.config.ts
import { themes as prismThemes } from 'prism-react-renderer';
import type { Config } from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  title: 'ResultSafe',
  tagline: 'Functional Result type for TypeScript',
  favicon: 'img/favicon.ico',

  // Set production URL
  url: 'https://resultsafe.github.io',
  baseUrl: '/resultsafe/',

  // GitHub Pages deployment
  organizationName: 'resultsafe',
  projectName: 'resultsafe',

  // Build configuration
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  // i18n support
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'ru'],
    localeConfigs: {
      en: {
        htmlLang: 'en-US',
      },
      ru: {
        htmlLang: 'ru-RU',
      },
    },
  },

  // Preset configuration
  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          editUrl: 'https://github.com/resultsafe/resultsafe/tree/main/docs/',
          showLastUpdateAuthor: true,
          showLastUpdateTime: true,
        },
        blog: false, // Disable blog for now
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    navbar: {
      title: 'ResultSafe',
      logo: {
        alt: 'ResultSafe Logo',
        src: 'img/logo.svg',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'docsSidebar',
          position: 'left',
          label: 'Documentation',
        },
        {
          type: 'docSidebar',
          sidebarId: 'apiSidebar',
          position: 'left',
          label: 'API',
        },
        {
          type: 'localeDropdown',
          position: 'right',
        },
        {
          href: 'https://github.com/resultsafe/resultsafe',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Docs',
          items: [
            {
              label: 'Introduction',
              to: '/docs/introduction/overview',
            },
            {
              label: 'API',
              to: '/docs/api/core-fp-result',
            },
          ],
        },
        {
          title: 'Community',
          items: [
            {
              label: 'GitHub',
              href: 'https://github.com/resultsafe/resultsafe',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Denis Savasteev. Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
      additionalLanguages: ['typescript', 'javascript', 'bash'],
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
```

#### Step 1.3: Create Sidebars

```typescript
// docs/sidebars.ts
import type { SidebarsConfig } from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  docsSidebar: [
    {
      type: 'category',
      label: 'Introduction',
      link: {
        type: 'doc',
        id: 'introduction/overview',
      },
      items: [
        'introduction/overview',
        'introduction/installation',
        'introduction/quick-start',
      ],
    },
    {
      type: 'category',
      label: 'Guides',
      link: {
        type: 'doc',
        id: 'guides/index',
      },
      items: ['guides/basic-usage', 'guides/error-handling', 'guides/chaining'],
    },
    {
      type: 'category',
      label: 'Patterns',
      link: {
        type: 'doc',
        id: 'patterns/index',
      },
      items: ['patterns/async', 'patterns/http', 'patterns/validation'],
    },
  ],

  apiSidebar: [
    {
      type: 'category',
      label: '@resultsafe/core-fp-result',
      link: {
        type: 'doc',
        id: 'api/core-fp-result/index',
      },
      items: [
        {
          type: 'category',
          label: 'Constructors',
          items: [
            'api/core-fp-result/constructors/Ok',
            'api/core-fp-result/constructors/Err',
          ],
        },
        {
          type: 'category',
          label: 'Guards',
          items: [
            'api/core-fp-result/guards/isOk',
            'api/core-fp-result/guards/isErr',
          ],
        },
        {
          type: 'category',
          label: 'Methods',
          items: [
            'api/core-fp-result/methods/map',
            'api/core-fp-result/methods/mapErr',
          ],
        },
      ],
    },
  ],
};

export default sidebars;
```

#### Step 1.4: Create Initial Documentation

```bash
# Create directory structure
mkdir -p docs/docs/introduction
mkdir -p docs/docs/guides
mkdir -p docs/docs/patterns
mkdir -p docs/docs/api/core-fp-result
```

**Example: docs/docs/introduction/01-overview.md**

````markdown
---
id: overview
title: Overview
sidebar_label: Overview
description: Introduction to ResultSafe - Functional Result type for TypeScript
---

# ResultSafe

**Functional Result type for TypeScript with explicit error handling.**

## Features

- ✅ Type-safe error handling
- ✅ Rust-style Result type
- ✅ Zero dependencies
- ✅ Tree-shakable
- ✅ AI-friendly documentation

## Quick Example

```typescript
import { Ok, Err, match } from '@resultsafe/core-fp-result';

const divide = (a: number, b: number) => {
  if (b === 0) {
    return Err('Division by zero');
  }
  return Ok(a / b);
};

const result = divide(10, 2);
match(
  result,
  (value) => console.log(value), // 5
  (error) => console.error(error),
);
```
````

## Installation

```bash
npm install @resultsafe/core-fp-result
```

## Next Steps

- [Installation](./02-installation.md)
- [Quick Start](./03-quick-start.md)
- [API Reference](../api/core-fp-result/index.md)

````

---

### Phase 2: Multi-Language Support (Week 2)

**Goal:** Full English + Russian support

#### Step 2.1: Configure i18n

Already configured in `docusaurus.config.ts` (see Phase 1).

#### Step 2.2: Create Russian Translations

```bash
# Create Russian translation directories
mkdir -p docs/i18n/ru/docusaurus-plugin-content-docs/current
mkdir -p docs/i18n/ru/docusaurus-theme-classic
````

**Example: docs/i18n/ru/docusaurus-plugin-content-docs/current/introduction/01-overview.md**

```markdown
---
id: overview
title: Обзор
sidebar_label: Обзор
description: Введение в ResultSafe - функциональный тип Result для TypeScript
---

# ResultSafe

**Функциональный тип Result для TypeScript с явной обработкой ошибок.**

## Возможности

- ✅ Типобезопасная обработка ошибок
- ✅ Result тип в стиле Rust
- ✅ Без зависимостей
- ✅ Tree-shakable
- ✅ AI-дружелюбная документация
```

#### Step 2.3: Translate UI Elements

**docs/i18n/ru/docusaurus-theme-classic/navbar.json**

```json
{
  "item.label.Documentation": "Документация",
  "item.label.API": "API",
  "item.label.GitHub": "GitHub"
}
```

#### Step 2.4: Add Language Switcher

Already configured in `docusaurus.config.ts`:

```typescript
i18n: {
  defaultLocale: 'en',
  locales: ['en', 'ru'],
},
```

---

### Phase 3: Package Integration (Week 3)

**Goal:** Auto-generate docs from `@resultsafe/core-fp-result`

#### Step 3.1: Create Generator Script

**tools/artifacts/platforms/web/docusaurus.ts**

```typescript
import { generateTypedoc } from './generators/typedoc';
import { copyExamples } from './generators/examples';
import { generateSidebars } from './generators/sidebars';

export async function generateDocusaurus() {
  console.log('Generating Docusaurus site...');

  // Step 1: Generate API docs from Typedoc
  await generateTypedoc({
    sourceDir: 'packages/core/fp/result/src',
    outputDir: 'docs/docs/api/core-fp-result',
  });

  // Step 2: Copy and transform examples
  await copyExamples({
    sourceDir: 'packages/core/fp/result/__examples__',
    outputDir: 'docs/docs/examples',
  });

  // Step 3: Generate sidebars
  await generateSidebars({
    apiDir: 'docs/docs/api',
    examplesDir: 'docs/docs/examples',
    output: 'docs/sidebars.ts',
  });

  console.log('Docusaurus site generated successfully!');
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  generateDocusaurus();
}
```

#### Step 3.2: Typedoc Integration

```bash
# Install Typedoc
cd docs
pnpm add -D typedoc typedoc-plugin-markdown
```

**docs/typedoc.json**

```json
{
  "entryPoints": ["../packages/core/fp/result/src/index.ts"],
  "plugin": ["typedoc-plugin-markdown"],
  "out": "./docs/api/core-fp-result",
  "readme": "none",
  "excludePrivate": true,
  "excludeProtected": false,
  "includeVersion": true,
  "categorizeByGroup": true,
  "categoryOrder": ["Constructors", "Guards", "Methods", "*"],
  "navigationLinks": {
    "GitHub": "https://github.com/resultsafe/resultsafe"
  }
}
```

---

### Phase 4: Build & Deploy (Week 4)

**Goal:** Automated builds and deployment

#### Step 4.1: Add Build Scripts

**docs/package.json**

```json
{
  "scripts": {
    "docusaurus": "docusaurus",
    "start": "docusaurus start",
    "build": "docusaurus build",
    "swizzle": "docusaurus swizzle",
    "deploy": "docusaurus deploy",
    "clear": "docusaurus clear",
    "serve": "docusaurus serve",
    "write-translations": "docusaurus write-translations",
    "write-heading-ids": "docusaurus write-heading-ids"
  }
}
```

**Root package.json** (already added)

```json
{
  "scripts": {
    "artifacts:web:docusaurus": "tsx tools/artifacts/platforms/web/docusaurus.ts"
  }
}
```

#### Step 4.2: GitHub Actions Workflow

**.github/workflows/docs.yml**

```yaml
name: Deploy Documentation

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: 'pages'
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'pnpm'

      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      - name: Generate API docs
        run: pnpm run artifacts:web:docusaurus

      - name: Build Docusaurus
        run: pnpm run build
        working-directory: ./docs

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: ./docs/build

  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}

    runs-on: ubuntu-latest
    needs: build

    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

#### Step 4.3: Local Testing

```bash
# Start development server
cd docs
pnpm run start

# Build for production
pnpm run build

# Preview production build
pnpm run serve
```

---

## 📊 Timeline

| Phase       | Duration | Tasks                       | Deliverables                 |
| ----------- | -------- | --------------------------- | ---------------------------- |
| **Phase 1** | Week 1   | Setup, config, initial docs | Basic site with English docs |
| **Phase 2** | Week 2   | i18n, translations          | Multi-language (EN/RU)       |
| **Phase 3** | Week 3   | Auto-generation, Typedoc    | API docs from source         |
| **Phase 4** | Week 4   | CI/CD, deployment           | Automated builds             |

---

## ✅ Checklist

### Phase 1: Setup

- [ ] Initialize Docusaurus
- [ ] Configure docusaurus.config.ts
- [ ] Create sidebars.ts
- [ ] Add initial documentation
- [ ] Test local build

### Phase 2: Multi-Language

- [ ] Configure i18n
- [ ] Create Russian translations
- [ ] Translate UI elements
- [ ] Test language switcher

### Phase 3: Package Integration

- [ ] Create generator script
- [ ] Configure Typedoc
- [ ] Auto-generate API docs
- [ ] Copy examples
- [ ] Generate sidebars

### Phase 4: Deploy

- [ ] Add build scripts
- [ ] Create GitHub Actions workflow
- [ ] Test deployment
- [ ] Configure custom domain (optional)

---

## 📊 Progress Tracking

**For detailed progress tracking, see: [ROADMAP.md](./ROADMAP.md)**

**Current Status:**

- **Phase:** Not Started
- **Started:** -
- **Last Updated:** 2026-03-27

---

## 📚 Resources

- [Docusaurus Documentation](https://docusaurus.io/docs)
- [Docusaurus i18n Guide](https://docusaurus.io/docs/i18n/introduction)
- [Docusaurus API Docs](https://docusaurus.io/docs/api/plugins/@docusaurus/plugin-content-docs)
- [Typedoc Plugin](https://github.com/tgreyuk/typedoc-plugin-markdown)
- [GitHub Pages Deployment](https://docusaurus.io/docs/deployment#github-pages)

---

**Last Updated:** 2026-03-27  
**Version:** 1.0.1  
**Maintainer:** Denis Savasteev  
**Status:** Active  
**Next Phase:** Phase 1 - Setup & Configuration
