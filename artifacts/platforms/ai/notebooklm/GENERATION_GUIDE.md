# NotebookLM RAG Generation Guide

**For:** Developers & AI Agents  
**Version:** 1.0.0  
**Last Updated:** 2026-03-27

---

## 📋 Overview

This guide explains how to generate RAG-optimized documentation from code examples and import them into Google NotebookLM.

---

## 🎯 When to Regenerate

Regenerate NotebookLM files when:
- ✅ New examples added to `__examples__/`
- ✅ JSDoc comments updated
- ✅ API changes (new methods, guards, etc.)
- ✅ Before each release
- ✅ Monthly maintenance

---

## 🔄 Generation Process

### Step 1: Verify Examples Have JSDoc

All examples must have `@module` tag:

```typescript
/**
 * @module 001-basic-usage
 * @title Creating Ok Values
 * @description Learn how to create successful Result values
 * @tags result,ok,constructor
 * @category 00-quick-start
 */
```

**Check for missing tags:**
```bash
cd e:\10-projects\lib\resultsafe
pnpm exec tsx scripts/add-module-tags.ts
```

**Expected output:**
```
✅ All examples have complete JSDoc!
```

---

### Step 2: Generate RAG Files

**Run generator:**
```bash
cd e:\10-projects\lib\resultsafe
pnpm exec tsx artifacts/platforms/ai/notebooklm/scripts/generate-rag-optimized.ts
```

**Expected output:**
```
🔄 Generating NotebookLM RAG documentation...

📁 Found 51 example files
✅ Parsed 51 examples
✅ Generated 01-getting-started.md (4 docs)
✅ Generated 02-core-concepts.md (38 docs)
✅ Generated 07-real-world.md (9 docs)
🎉 Generated 3 files in .../output
```

**Output files:**
```
artifacts/platforms/ai/notebooklm/output/
├── 01-getting-started.md      # Quick Start examples
├── 02-core-concepts.md        # API Reference examples
└── 07-real-world.md           # Pattern examples
```

---

### Step 3: Validate Output

**Run validation:**
```bash
cd e:\10-projects\lib\resultsafe
pnpm exec tsx artifacts/platforms/ai/notebooklm/scripts/validate.ts
```

**Expected output:**
```
🔍 Starting validation...

📊 Validation Summary:
   Total: 3
   Passed: 3 ✅
   Failed: 0

✅ All validations passed!
```

**NotebookLM Limits:**
| Limit | Value | Status |
|-------|-------|--------|
| Max sources | 50 | ✅ 3 files |
| Max words/file | 500K | ✅ Max 35K |
| Max size/file | 25MB | ✅ Max 0.5MB |

---

### Step 4: Import to NotebookLM

1. **Open** https://notebooklm.google.com/
2. **Create** new notebook: "ResultSafe Documentation"
3. **Click** "Add source" → "Upload"
4. **Upload** files from:
   ```
   artifacts/platforms/ai/notebooklm/output/
   ```
5. **Wait** for indexing (~1-2 minutes)
6. **Test** with query: "Show Ok constructor examples"

---

## 🤖 AI Agent Rules

### For Cursor AI / GitHub Copilot

When user asks about RAG generation:

1. **Check prerequisites:**
   - Examples in `__examples__/`
   - JSDoc with `@module` tags
   - Node.js 20+, pnpm 10+

2. **Run generation:**
   ```bash
   pnpm exec tsx artifacts/platforms/ai/notebooklm/scripts/generate-rag-optimized.ts
   ```

3. **Validate:**
   ```bash
   pnpm exec tsx artifacts/platforms/ai/notebooklm/scripts/validate.ts
   ```

4. **Guide import:**
   - Direct user to NotebookLM
   - Show upload steps
   - Suggest test queries

---

## 📁 File Locations

| File | Purpose | Location |
|------|---------|----------|
| Generator | Creates RAG files | `artifacts/.../notebooklm/scripts/generate-rag-optimized.ts` |
| Validator | Checks limits | `artifacts/.../notebooklm/scripts/validate.ts` |
| Output | RAG files | `artifacts/.../notebooklm/output/` |
| JSDoc Helper | Adds tags | `scripts/add-module-tags.ts` |

---

## 🔧 Troubleshooting

### "No @module tag found"

**Fix:**
```bash
pnpm exec tsx scripts/add-module-tags.ts
```

### "File exceeds word limit"

**Fix:** Split into multiple files by category

### "Examples not parsed"

**Check:**
1. File is named `example.ts`
2. Has JSDoc with `@module`
3. Located in `__examples__/`

---

## 📊 Expected Output

### File Structure
```
output/
├── 01-getting-started.md      # 4-8 examples, ~8K words
├── 02-core-concepts.md        # 30-40 examples, ~35K words
└── 07-real-world.md           # 8-12 examples, ~20K words
```

### Content Format
Each file contains Q/A format:
```markdown
# How do I create Ok values?

## Quick Answer
Use Ok() constructor to handle this.

## Detailed Explanation
...

## Example Code
```typescript
const result = Ok(42);
```

## Related Concepts
- [[Ok]]
- [[Result]]
- [[constructors]]
```

---

## ✅ Checklist

### Before Generation
- [ ] All examples have `@module` tag
- [ ] All examples have `@title` tag
- [ ] All examples have `@description` tag
- [ ] JSDoc validation passes

### After Generation
- [ ] 3 files created in `output/`
- [ ] Validation passes (0 failures)
- [ ] Total words ~63K
- [ ] Files imported to NotebookLM
- [ ] Test queries work

---

## 📚 Related Documents

- [TASK-AI-RAG-001.md](../../../docs/TASK-AI-RAG-001.md) - Main task
- [README.md](../README.md) - NotebookLM import guide
- [CONTEXT.md](../../cursor/CONTEXT.md) - AI agent context

---

**Last Updated:** 2026-03-27  
**Maintainer:** Denis Savasteev  
**Status:** ✅ Production Ready
