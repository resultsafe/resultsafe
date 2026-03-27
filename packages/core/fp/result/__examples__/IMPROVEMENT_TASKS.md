# AI JSDOC Standard - Improvement Tasks

**Created:** 2026-03-27  
**Priority:** Critical → Optional  
**Status:** Backlog

---

## 🚨 Critical (Must Have)

### 1. Table of Contents для навигации в NotebookLM

**Priority:** P0 - Critical  
**Effort:** Low  
**Impact:** High

**Task:**
Добавить автоматическое оглавление в начало AI_JSDOC_STANDARD.md для улучшения навигации в RAG системах.

**Implementation:**
```markdown
## Contents

1. [Overview](#overview)
2. [Specification](#specification)
3. [AI JSON Structure](#ai-json-structure)
4. [Constraints](#constraints)
5. [Full Example](#full-example)
6. [Implementation](#implementation)
```

**Files to update:**
- `__examples__/AI_JSDOC_STANDARD.md`

**Acceptance Criteria:**
- [ ] TOC добавлен в начало документа
- [ ] Все ссылки работают (якоря правильные)
- [ ] Уровни H1/H2/H3 соответствуют оглавлению

---

### 2. Cross-reference links для связности документов

**Priority:** P0 - Critical  
**Effort:** Medium  
**Impact:** High

**Task:**
Добавить явные ссылки между документами для улучшения RAG retrieval и навигации.

**Implementation:**
```markdown
### See Also

- [CI/CD Integration](./CI_CD_INTEGRATION.md) — Deployment pipelines
- [Quick Start](./00-quick-start/README.md) — Getting started guide
- [001-basic-usage](./01-api-reference/01-constructors/01-ok/001-basic-usage/example.ts) — First example
```

**Files to update:**
- `__examples__/AI_JSDOC_STANDARD.md`
- `__examples__/CI_CD_INTEGRATION.md`
- `__examples__/README.md`

**Acceptance Criteria:**
- [ ] Все документы связаны между собой
- [ ] Ссылки валидны (не битые)
- [ ] Минимум 3 cross-reference на документ

---

### 3. Author/Source attribution

**Priority:** P0 - Critical  
**Impact:** Medium

**Task:**
Добавить информацию об авторе и источнике для proper attribution в RAG системах.

**Implementation:**
```markdown
**Author:** Denis Savasteev
**Source:** @resultsafe/core-fp-result
**License:** MIT
**Repository:** https://github.com/Livooon/resultsafe
**Package:** https://www.npmjs.com/package/@resultsafe/core-fp-result
```

**Files to update:**
- `__examples__/AI_JSDOC_STANDARD.md` (в начало и конец)
- `__examples__/CI_CD_INTEGRATION.md`
- Все примеры в `__examples__/` (в JSDoc)

**Acceptance Criteria:**
- [ ] Author указан в каждом документе
- [ ] Source link работает
- [ ] License указана

---

## ⚠️ High Priority (Should Have)

### 4. Confidence score для оценки достоверности

**Priority:** P1 - High  
**Effort:** Low  
**Impact:** Medium

**Task:**
Добавить поле `confidence` в `@ai.rag` JSON для оценки достоверности информации.

**Implementation:**
```json
"rag": {
  "queries": ["how to create Ok result"],
  "intents": ["learning", "practical"],
  "expectedAnswer": "Use Ok(value) to create success result",
  "confidence": 0.95
}
```

**Confidence Levels:**
- `0.95-1.0` — Verified, production-ready
- `0.80-0.94` — Tested, minor issues possible
- `0.60-0.79` — Experimental, use with caution
- `<0.60` — Draft, not for production

**Files to update:**
- `__examples__/AI_JSDOC_STANDARD.md` (документация)
- `__scripts__/validate-ai-json.js` (валидация диапазона)
- Все примеры с `@ai` JSON

**Acceptance Criteria:**
- [ ] Поле `confidence` добавлено в схему
- [ ] Валидация проверяет диапазон 0.0-1.0
- [ ] Все примеры обновлены

---

### 5. Better chunking для RAG retrieval

**Priority:** P1 - High  
**Effort:** Medium  
**Impact:** High

**Task:**
Улучшить `chunkHint` для лучшего разделения документов в RAG системах.

**Implementation:**
```json
"chunkHint": "self-contained"  // Сейчас
"chunkHint": {
  "type": "self-contained",
  "section": "constructors",
  "subsection": "ok",
  "tokenCount": 300,
  "relatedChunks": ["002-with-generics", "003-real-world"]
}
```

**Files to update:**
- `__examples__/AI_JSDOC_STANDARD.md` (спецификация)
- `__scripts__/validate-ai-json.js` (валидация)
- Все примеры

**Acceptance Criteria:**
- [ ] Структура `chunkHint` определена
- [ ] Валидация поддерживает новый формат
- [ ] Примеры обновлены

---

### 6. Multiple examples для контекста

**Priority:** P1 - High  
**Effort:** Medium  
**Impact:** Medium

**Task:**
Требовать минимум 2 примера в каждом файле для лучшего контекста в LLM.

**Implementation:**
```markdown
## Requirements

- Minimum 2 examples per file
- At least one basic example
- At least one real-world example
```

**Files to update:**
- `__examples__/AI_JSDOC_STANDARD.md` (требования)
- `__scripts__/validate-ai-json.js` (проверка количества)
- Все примеры (добавить второй пример где нет)

**Acceptance Criteria:**
- [ ] Требование задокументировано
- [ ] Валидация проверяет количество примеров
- [ ] Все файлы имеют 2+ примера

---

## 📝 Optional (Nice to Have)

### 7. Citation format для академического использования

**Priority:** P2 - Optional  
**Effort:** Low  
**Impact:** Low

**Task:**
Добавить формат цитирования для академических работ.

**Implementation:**
```markdown
## Citation

```bibtex
@manual{resultsafe-core-fp-result,
  title = {AI-Optimized JSDoc Standard v2.0},
  author = {Denis Savasteev},
  year = {2026},
  url = {https://github.com/Livooon/resultsafe},
  version = {2.0.0}
}
```

**Files to update:**
- `__examples__/AI_JSDOC_STANDARD.md` (в конец)
- `__examples__/README.md`

**Acceptance Criteria:**
- [ ] BibTeX формат добавлен
- [ ] APA format тоже доступен
- [ ] Ссылка на citation в README

---

### 8. Last modified timestamp

**Priority:** P2 - Optional  
**Effort:** Low  
**Impact:** Low

**Task:**
Добавить точную дату последнего изменения для отслеживания актуальности.

**Implementation:**
```markdown
**Last Updated:** 2026-03-27T14:30:00Z
**Last Modified By:** Denis Savasteev
**Changes:** Added confidence score field
```

**Files to update:**
- `__examples__/AI_JSDOC_STANDARD.md`
- `__examples__/CI_CD_INTEGRATION.md`
- Все примеры (в JSDoc: `@lastModified`)

**Acceptance Criteria:**
- [ ] Timestamp в ISO 8601 формате
- [ ] Автоматическое обновление через Git hook
- [ ] История изменений ведётся

---

## 📊 Implementation Plan

### Phase 1: Critical (Week 1)

```bash
# Tasks 1-3
- [ ] Add Table of Contents
- [ ] Add cross-reference links
- [ ] Add author/source attribution
```

**Estimated Effort:** 4 hours  
**Priority:** P0  
**Blocks:** RAG optimization

---

### Phase 2: High Priority (Week 2)

```bash
# Tasks 4-6
- [ ] Add confidence score
- [ ] Improve chunking
- [ ] Add multiple examples
```

**Estimated Effort:** 8 hours  
**Priority:** P1  
**Blocks:** Production readiness

---

### Phase 3: Optional (Week 3-4)

```bash
# Tasks 7-8
- [ ] Add citation format
- [ ] Add last modified timestamp
```

**Estimated Effort:** 2 hours  
**Priority:** P2  
**Blocks:** None (nice to have)

---

## 🎯 Success Metrics

| Metric | Before | After | Target |
|--------|--------|-------|--------|
| **RAG retrieval accuracy** | 85% | ? | 95% |
| **NotebookLM compatibility** | 75% | ? | 95% |
| **Cross-document links** | 0 | ? | 3+ per doc |
| **Examples per file** | 1 | ? | 2+ |
| **Confidence score coverage** | 0% | ? | 100% |

---

## 📝 Changelog

| Date | Version | Changes | Author |
|------|---------|---------|--------|
| 2026-03-27 | 1.0.0 | Initial task list | Denis |

---

**Next Review:** 2026-04-03  
**Owner:** Denis Savasteev  
**Status:** Backlog
