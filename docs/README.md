# Docusaurus Structure

**Purpose:** Official Docusaurus directory structure following best practices.

**Reference:** [docusaurus.io/docs](https://docusaurus.io/docs)

---

## 📁 Official Structure

```
resultsafe/
├── docs/                      # Docusaurus website source
│   │
│   ├── blog/                  # Blog posts (optional)
│   │   ├── 2026-03-27-welcome.md
│   │   └── _category_.json
│   │
│   ├── docs/                  # Documentation Markdown files
│   │   ├── introduction/      # Getting started
│   │   │   ├── 01-overview.md
│   │   │   ├── 02-installation.md
│   │   │   └── 03-quick-start.md
│   │   │
│   │   ├── guides/            # Usage guides
│   │   │   ├── index.md
│   │   │   └── basic-usage.md
│   │   │
│   │   ├── patterns/          # Real-world patterns
│   │   │   └── index.md
│   │   │
│   │   └── api/               # API reference (auto-generated)
│   │       └── core-fp-result/
│   │
│   ├── src/                   # React components
│   │   ├── css/              # Custom CSS
│   │   │   └── custom.css
│   │   ├── pages/            # Custom pages
│   │   │   ├── index.tsx
│   │   │   └── index.module.css
│   │   └── components/       # Reusable components
│   │       └── HomepageFeatures.tsx
│   │
│   ├── static/               # Static assets (copied as-is)
│   │   ├── img/             # Images
│   │   │   ├── logo.svg
│   │   │   └── favicon.ico
│   │   └── robots.txt
│   │
│   ├── i18n/                 # Internationalization (translations)
│   │   ├── en/              # English (default locale)
│   │   │   ├── code.json    # React component translations
│   │   │   ├── docusaurus-plugin-content-docs/
│   │   │   │   └── current/ # Translated docs
│   │   │   │       ├── introduction/
│   │   │   │       ├── guides/
│   │   │   │       └── current.json
│   │   │   └── docusaurus-theme-classic/
│   │   │       ├── navbar.json
│   │   │       └── footer.json
│   │   │
│   │   └── ru/              # Russian (additional locale)
│   │       └── (same structure as en/)
│   │
│   ├── docusaurus.config.ts  # Main configuration
│   ├── sidebars.ts          # Navigation sidebars
│   ├── package.json         # Dependencies
│   ├── tsconfig.json        # TypeScript config
│   └── README.md            # This file
│
└── artifacts/                # Generated output (NOT source)
    └── platforms/
        └── web/
            └── docusaurus/   # Production build
                └── build/
```

---

## 📋 Key Directories

### `docs/` - Root
The main Docusaurus website directory.

### `docs/docs/` - Documentation
**Purpose:** Markdown files for documentation.

**Structure:**
```
docs/
├── introduction/
│   ├── 01-overview.md
│   ├── 02-installation.md
│   └── 03-quick-start.md
├── guides/
├── patterns/
└── api/
```

**Best Practices:**
- Prefix files with numbers for ordering (`01-`, `02-`, etc.)
- Use lowercase with hyphens (`basic-usage.md`)
- Organize by category folders

### `docs/src/` - React Components
**Purpose:** Custom React components and pages.

**Structure:**
```
src/
├── css/
│   └── custom.css          # Global custom styles
├── pages/
│   ├── index.tsx           # Home page
│   └── index.module.css    # Home page styles
└── components/
    └── HomepageFeatures.tsx
```

### `docs/static/` - Static Assets
**Purpose:** Files copied as-is to the build output.

**Structure:**
```
static/
├── img/
│   ├── logo.svg
│   └── favicon.ico
└── robots.txt
```

**Access in code:**
```jsx
<img src="/img/logo.svg" alt="Logo" />
```

### `docs/i18n/` - Translations
**Purpose:** Internationalization files.

**Structure:**
```
i18n/
├── [locale]/
│   ├── code.json                          # React translations
│   ├── docusaurus-plugin-content-docs/
│   │   └── current/                       # Translated docs
│   │       ├── introduction/
│   │       └── current.json               # Sidebar labels
│   └── docusaurus-theme-classic/
│       ├── navbar.json                    # Navbar translations
│       └── footer.json                    # Footer translations
```

**Generate translation files:**
```bash
pnpm run write-translations
```

---

## 🔧 Configuration Files

### `docusaurus.config.ts`
Main configuration file.

**Key settings:**
```typescript
export default {
  title: 'ResultSafe',
  url: 'https://resultsafe.github.io',
  baseUrl: '/resultsafe/',
  
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'ru'],
  },
  
  presets: [
    ['classic', {
      docs: {
        sidebarPath: './sidebars.ts',
      },
    }],
  ],
};
```

### `sidebars.ts`
Navigation configuration.

**Example:**
```typescript
export default {
  docsSidebar: [
    {
      type: 'category',
      label: 'Introduction',
      items: [
        'introduction/01-overview',
        'introduction/02-installation',
      ],
    },
  ],
};
```

---

## 🚀 Commands

```bash
# Start development server
pnpm run start

# Build for production
pnpm run build

# Serve production build locally
pnpm run serve

# Generate translation files
pnpm run write-translations

# Write heading IDs for translations
pnpm run write-heading-ids
```

---

## 📚 References

- [Docusaurus Installation](https://docusaurus.io/docs/installation)
- [Docusaurus i18n](https://docusaurus.io/docs/i18n/introduction)
- [Docusaurus Docs](https://docusaurus.io/docs/docs-introduction)
- [Docusaurus Static Assets](https://docusaurus.io/docs/static-assets)

---

**Last Updated:** 2026-03-27  
**Version:** 3.0.0 (Official Docusaurus Standard)  
**Maintainer:** Denis Savasteev
