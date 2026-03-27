# Documentation Roadmap

**Version:** 2.0.0  
**Effective Date:** 2026-03-27  
**Author:** Denis Savasteev  
**Status:** Active

---

## 🎯 Goal

Create unified documentation that:

- Serves as source for multiple platforms
- Supports multi-language (EN/RU)
- Generates artifacts for RAG systems (NotebookLM, Cursor)
- Auto-generates API docs from source code

---

## 📋 Phases

### Phase 1: Setup & Configuration ✅

**Status:** Complete  
**Date:** 2026-03-27

**Completed:**

- [x] Initialize Docusaurus
- [x] Configure multi-language support
- [x] Create basic documentation structure
- [x] Add navigation (sidebars)
- [x] Create initial content

---

### Phase 2: Architecture Refactoring 🔄

**Status:** In Progress  
**Date:** 2026-03-27

**Tasks:**

- [x] Separate source from generated files
- [x] Move Docusaurus to `artifacts/platforms/web/`
- [x] Create structure for AI/RAG systems
- [ ] Copy source documentation
- [ ] Configure generators
- [ ] Test build pipeline

---

### Phase 3: Multi-Language Support ⏳

**Status:** Not Started

**Tasks:**

- [ ] Configure i18n pipeline
- [ ] Create English translations
- [ ] Create Russian translations
- [ ] Add language switcher
- [ ] Test locale builds

---

### Phase 4: AI/RAG Integration ⏳

**Status:** Not Started

**Tasks:**

- [ ] Generate NotebookLM sources
- [ ] Create Cursor context files
- [ ] Generate embeddings metadata
- [ ] Test RAG import
- [ ] Document AI usage patterns

---

### Phase 5: Automation ⏳

**Status:** Not Started

**Tasks:**

- [ ] Auto-generate API docs from Typedoc
- [ ] Extract examples from packages/
- [ ] CI/CD pipeline for artifacts
- [ ] Automated deployment

---

## 📁 Target Structure

```
docs/
├── source/           # Markdown source
├── i18n/             # Translations (EN/RU)
└── config/           # Configuration

artifacts/
└── platforms/
    ├── web/
    │   └── docusaurus/   # Website build
    └── ai/
        ├── notebooklm/   # RAG sources
        ├── cursor/       # IDE context
        └── embeddings/   # Vector data
```

---

## 📊 Progress

| Phase   | Status         | Start      | End        |
| ------- | -------------- | ---------- | ---------- |
| Phase 1 | ✅ Complete    | 2026-03-27 | 2026-03-27 |
| Phase 2 | 🔄 In Progress | 2026-03-27 | -          |
| Phase 3 | ⏳ Pending     | -          | -          |
| Phase 4 | ⏳ Pending     | -          | -          |
| Phase 5 | ⏳ Pending     | -          | -          |

---

**Last Updated:** 2026-03-27  
**Maintainer:** Denis Savasteev
