# Sub-Task: AI/RAG Integration - Phase 3 NotebookLM RAG Generator

**Task ID:** `TASK-AI-RAG-001.3`  
**Parent Task:** `TASK-AI-RAG-001`  
**Status:** 🟡 Blocked  
**Priority:** High  
**Estimated Effort:** 2.5 hours  
**Assignee:** Development Team

---

## 📋 Overview

Implement automated generator that converts JSDoc-documented examples into RAG-optimized Markdown files for Google NotebookLM with Question/Answer format and semantic structure.

---

## 🎯 Objectives

### Primary Goals
- Parse JSDoc from all 51 example files
- Generate Question/Answer format for RAG
- Group examples into 8 thematic categories
- Add cross-references and search keywords
- Stay within NotebookLM limits

---

## 📁 Deliverables

### Script: `generate-rag-optimized.ts`

**Location:** `artifacts/platforms/ai/notebooklm/scripts/generate-rag-optimized.ts`

**Features:**
- JSDoc parsing with `comment-parser`
- Question generation from descriptions
- Code extraction and formatting
- Category-based grouping
- Cross-reference generation

---

## ✅ Implementation Steps

### Step 1: JSDoc Parser
```typescript
import { parse } from 'comment-parser';

interface RAGDoc {
  module: string;
  title: string;
  question: string;      // Generated from description
  answer: string;        // Quick answer (2-3 sentences)
  description: string;   // Full description
  code: string;          // Code example
  tags: string[];
  category: string;
  difficulty: string;
  related: string[];
}

function parseExampleFile(filePath: string): RAGDoc | null {
  const content = readFileSync(filePath, 'utf-8');
  const comments = parse(content);
  
  const jsdoc = comments.find(c => c.tags.some(t => t.tag === 'module'));
  if (!jsdoc) return null;
  
  const getTag = (name: string) => 
    jsdoc.tags.find(t => t.tag === name)?.description || '';
  
  const code = content.replace(/\/\*\*[\s\S]*?\*\//, '').trim();
  
  // Generate question from description
  const description = getTag('description');
  const question = `How do I ${description.toLowerCase().split('.')[0]}?`;
  
  // Generate quick answer
  const functions = code.match(/\b(Ok|Err|match|map|andThen|unwrap)\b/g) || [];
  const answer = `Use ${[...new Set(functions)].join(', ')} to handle this.`;
  
  return {
    module: getTag('module'),
    title: getTag('title') || 'Example',
    question,
    answer,
    description,
    code,
    tags: getTag('tags').split(',').map(t => t.trim()).filter(Boolean),
    category: getTag('category') || 'examples',
    difficulty: getTag('difficulty') || 'intermediate',
    related: extractRelated(code)
  };
}
```

### Step 2: RAG Formatter
```typescript
function formatForNotebookLM(docs: RAGDoc[]): string {
  return docs.map(doc => `
# ${doc.question}

## Quick Answer
${doc.answer}

## Detailed Explanation
${doc.description}

## Example Code
\`\`\`typescript
${doc.code}
\`\`\`

## When to Use
${generateWhenToUse(doc.category)}

## Key Functions
${doc.related.map(f => `- \`${f}\``).join('\n')}

## Related Concepts
${doc.related.map(r => `- [[${r}]]`).join('\n')}

## Metadata
- **Tags:** ${doc.tags.join(', ')}
- **Difficulty:** ${doc.difficulty}
- **Module:** ${doc.module}
`.trim()).join('\n\n---\n\n');
}
```

### Step 3: Category Grouping
```typescript
const CATEGORY_MAPPING = {
  'constructors': '02-core-concepts',
  'guards': '04-guards',
  'methods': '03-methods',
  'patterns': '07-real-world',
  'async': '06-async-patterns',
  'error-handling': '05-error-handling',
  'validation': '07-real-world',
  'quick-start': '01-getting-started'
};

function groupByCategory(docs: RAGDoc[]): Record<string, RAGDoc[]> {
  const grouped: Record<string, RAGDoc[]> = {};
  
  for (const doc of docs) {
    const category = CATEGORY_MAPPING[doc.category as keyof typeof CATEGORY_MAPPING] || '08-api-quick-reference';
    if (!grouped[category]) grouped[category] = [];
    grouped[category].push(doc);
  }
  
  return grouped;
}
```

### Step 4: File Generation
```typescript
const OUTPUT_FILES = {
  '01-getting-started': 'Getting Started with ResultSafe',
  '02-core-concepts': 'Core Concepts: Ok, Err, Result',
  '03-methods': 'Methods: Transformation and Chaining',
  '04-guards': 'Guards: Type Narrowing',
  '05-error-handling': 'Error Handling Patterns',
  '06-async-patterns': 'Async/Await Patterns',
  '07-real-world': 'Real-World Production Patterns',
  '08-api-quick-reference': 'API Quick Reference'
};

function generateAll(docs: RAGDoc[]) {
  const grouped = groupByCategory(docs);
  
  for (const [fileKey, fileDocs] of Object.entries(grouped)) {
    const title = OUTPUT_FILES[fileKey as keyof typeof OUTPUT_FILES];
    const content = `# ${title}\n\n${formatForNotebookLM(fileDocs)}`;
    
    writeFileSync(`../output/${fileKey}.md`, content);
    console.log(`✅ Generated ${fileKey}.md (${fileDocs.length} docs)`);
  }
}
```

---

## 📊 Output Files

| File | Topic | Target Words | Status |
|------|-------|--------------|--------|
| `01-getting-started.md` | Introduction | ~8K | ⏳ Pending |
| `02-core-concepts.md` | Ok, Err, Result | ~18K | ⏳ Pending |
| `03-methods.md` | map, andThen, match | ~35K | ⏳ Pending |
| `04-guards.md` | isOk, isErr | ~12K | ⏳ Pending |
| `05-error-handling.md` | unwrap, expect | ~22K | ⏳ Pending |
| `06-async-patterns.md` | Async operations | ~20K | ⏳ Pending |
| `07-real-world.md` | Production patterns | ~35K | ⏳ Pending |
| `08-api-quick-reference.md` | API reference | ~25K | ⏳ Pending |

**Total:** ~175K words across 8 files

---

## ✅ Acceptance Criteria

- [ ] All 51 examples parsed successfully
- [ ] 8 Markdown files generated
- [ ] Question/Answer format applied consistently
- [ ] Cross-references working ([[Link]] format)
- [ ] All files within NotebookLM limits
- [ ] Total word count ~175K

---

## 🔗 Dependencies

- **Blocks:** `TASK-AI-RAG-001.5` (Validation), `TASK-AI-RAG-001.6` (Testing)
- **Blocked by:** `TASK-AI-RAG-001.1` (Setup)
- **Related:** `TASK-AI-RAG-001` (Parent)

---

## 📝 Notes

- Use `comment-parser` for JSDoc parsing
- Generate questions from descriptions automatically
- Keep answers concise (2-3 sentences)
- Include code snippets in every section
- Use `[[Link]]` format for cross-references (NotebookLM compatible)

---

**Created:** 2026-03-27  
**Status:** 🟡 Blocked (waiting for Phase 1)  
**Parent Task:** `TASK-AI-RAG-001`
