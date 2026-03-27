# Sub-Task: AI/RAG Integration - Phase 5 Validation

**Task ID:** `TASK-AI-RAG-001.5`  
**Parent Task:** `TASK-AI-RAG-001`  
**Status:** 🟡 Blocked  
**Priority:** High  
**Estimated Effort:** 1 hour  
**Assignee:** Development Team

---

## 📋 Overview

Implement comprehensive validation system to ensure all generated files meet NotebookLM limits and quality standards before import.

---

## 🎯 Objectives

### Primary Goals
- Validate NotebookLM limits (sources, file size, word count)
- Check semantic metadata completeness
- Verify embedding dimensions
- Generate validation report
- Block deployment if validation fails

---

## 📁 Deliverables

### Script: `validate.ts`

**Location:** `artifacts/platforms/ai/notebooklm/scripts/validate.ts`

**Features:**
- File size validation (< 25MB each)
- Word count validation (< 500K each)
- Source count validation (< 50 total)
- Metadata completeness check
- Embedding dimension check (1536)
- Validation report generation

---

## ✅ Implementation Steps

### Step 1: NotebookLM Limits Validation
```typescript
import { readdirSync, readFileSync, statSync } from 'fs';

// Official NotebookLM limits (2024)
const LIMITS = {
  MAX_SOURCES: 50,              // Sources per notebook
  MAX_FILE_SIZE_MB: 25,         // File size limit
  MAX_WORDS_PER_SOURCE: 500_000, // Words per source
  MAX_TOTAL_STORAGE_MB: 500,    // Total storage
  SUPPORTED_FORMATS: ['.txt', '.pdf', '.md']
};

interface ValidationResult {
  file: string;
  sizeMB: number;
  wordCount: number;
  issues: string[];
  warnings: string[];
  passed: boolean;
}

function validateNotebookLM(): ValidationResult[] {
  const outputDir = './output';
  const files = readdirSync(outputDir).filter(f => f.endsWith('.md'));
  const results: ValidationResult[] = [];
  
  let totalSize = 0;
  
  for (const file of files) {
    const filePath = `${outputDir}/${file}`;
    const stats = statSync(filePath);
    const content = readFileSync(filePath, 'utf-8');
    
    const sizeMB = stats.size / (1024 * 1024);
    const wordCount = content.split(/\s+/).length;
    
    totalSize += sizeMB;
    
    const issues: string[] = [];
    const warnings: string[] = [];
    
    // Check file size
    if (sizeMB > LIMITS.MAX_FILE_SIZE_MB) {
      issues.push(`Size ${sizeMB.toFixed(2)}MB exceeds ${LIMITS.MAX_FILE_SIZE_MB}MB limit`);
    } else if (sizeMB > LIMITS.MAX_FILE_SIZE_MB * 0.9) {
      warnings.push(`Size approaching limit: ${sizeMB.toFixed(2)}MB`);
    }
    
    // Check word count
    if (wordCount > LIMITS.MAX_WORDS_PER_SOURCE) {
      issues.push(`Word count ${wordCount.toLocaleString()} exceeds ${LIMITS.MAX_WORDS_PER_SOURCE.toLocaleString()} limit`);
    } else if (wordCount > LIMITS.MAX_WORDS_PER_SOURCE * 0.9) {
      warnings.push(`Word count approaching limit: ${wordCount.toLocaleString()}`);
    }
    
    // Check minimum content
    if (wordCount < 1000) {
      warnings.push(`Less than 1000 words (may be too small)`);
    }
    
    results.push({
      file,
      sizeMB,
      wordCount,
      issues,
      warnings,
      passed: issues.length === 0
    });
  }
  
  // Check total sources
  if (files.length > LIMITS.MAX_SOURCES) {
    results.push({
      file: 'TOTAL',
      sizeMB: totalSize,
      wordCount: results.reduce((sum, r) => sum + r.wordCount, 0),
      issues: [`Total files (${files.length}) exceeds ${LIMITS.MAX_SOURCES} sources limit`],
      warnings: [],
      passed: false
    });
  }
  
  // Check total storage
  if (totalSize > LIMITS.MAX_TOTAL_STORAGE_MB) {
    results.push({
      file: 'TOTAL',
      sizeMB: totalSize,
      wordCount: results.reduce((sum, r) => sum + r.wordCount, 0),
      issues: [`Total size ${totalSize.toFixed(2)}MB exceeds ${LIMITS.MAX_TOTAL_STORAGE_MB}MB limit`],
      warnings: [],
      passed: false
    });
  }
  
  return results;
}
```

### Step 2: Semantic Metadata Validation
```typescript
function validateSemanticMetadata(): ValidationResult[] {
  const metadata = JSON.parse(readFileSync('../semantic/metadata.json', 'utf-8'));
  const chunks = JSON.parse(readFileSync('../semantic/chunks/chunks.json', 'utf-8'));
  const embeddings = JSON.parse(readFileSync('../semantic/embeddings/embeddings.json', 'utf-8'));
  
  const results: ValidationResult[] = [];
  
  // Check metadata completeness
  const requiredFields = ['id', 'title', 'description', 'keywords', 'category', 'vector_text'];
  for (const entry of metadata) {
    const missing = requiredFields.filter(f => !entry[f]);
    if (missing.length > 0) {
      results.push({
        file: `metadata:${entry.id}`,
        sizeMB: 0,
        wordCount: 0,
        issues: [`Missing fields: ${missing.join(', ')}`],
        warnings: [],
        passed: false
      });
    }
    
    // Check keywords count
    if (!entry.keywords || entry.keywords.length < 10) {
      results.push({
        file: `metadata:${entry.id}`,
        sizeMB: 0,
        wordCount: 0,
        issues: [],
        warnings: [`Less than 10 keywords (${entry.keywords?.length || 0})`],
        passed: true
      });
    }
  }
  
  // Check embedding dimensions
  for (const emb of embeddings) {
    if (emb.vector.length !== 1536) {
      results.push({
        file: `embeddings:${emb.id}`,
        sizeMB: 0,
        wordCount: 0,
        issues: [`Wrong embedding dimension: ${emb.vector.length} (expected 1536)`],
        warnings: [],
        passed: false
      });
    }
  }
  
  return results;
}
```

### Step 3: Validation Report
```typescript
function generateReport(results: ValidationResult[]): string {
  const totalFiles = results.length;
  const passed = results.filter(r => r.passed).length;
  const failed = totalFiles - passed;
  const totalWarnings = results.reduce((sum, r) => sum + r.warnings.length, 0);
  const totalIssues = results.reduce((sum, r) => sum + r.issues.length, 0);
  
  let report = `
# Validation Report

**Generated:** ${new Date().toISOString()}

## Summary
- **Total Files:** ${totalFiles}
- **Passed:** ${passed} ✅
- **Failed:** ${failed} ${failed > 0 ? '❌' : ''}
- **Warnings:** ${totalWarnings} ⚠️
- **Issues:** ${totalIssues} ${totalIssues > 0 ? '❌' : ''}

---

## Detailed Results

`;
  
  for (const result of results) {
    report += `### ${result.file}\n\n`;
    report += `- **Size:** ${result.sizeMB.toFixed(2)} MB\n`;
    report += `- **Words:** ${result.wordCount.toLocaleString()}\n`;
    report += `- **Status:** ${result.passed ? '✅ Pass' : '❌ Fail'}\n`;
    
    if (result.issues.length > 0) {
      report += `\n**Issues:**\n`;
      for (const issue of result.issues) {
        report += `- ❌ ${issue}\n`;
      }
    }
    
    if (result.warnings.length > 0) {
      report += `\n**Warnings:**\n`;
      for (const warning of result.warnings) {
        report += `- ⚠️ ${warning}\n`;
      }
    }
    
    report += '\n---\n\n';
  }
  
  return report;
}

// Main validation
function validate() {
  console.log('🔍 Starting validation...\n');
  
  // Validate NotebookLM files
  const notebookResults = validateNotebookLM();
  
  // Validate semantic metadata
  const semanticResults = validateSemanticMetadata();
  
  // Combine results
  const allResults = [...notebookResults, ...semanticResults];
  
  // Generate report
  const report = generateReport(allResults);
  writeFileSync('./VALIDATION_REPORT.md', report);
  
  // Print summary
  const passed = allResults.filter(r => r.passed).length;
  const failed = allResults.length - passed;
  
  console.log(`\n📊 Validation Summary:`);
  console.log(`   Total: ${allResults.length}`);
  console.log(`   Passed: ${passed}`);
  console.log(`   Failed: ${failed}`);
  
  if (failed === 0) {
    console.log('\n✅ All validations passed!');
  } else {
    console.log(`\n❌ ${failed} validation(s) failed`);
    console.log('See VALIDATION_REPORT.md for details');
    process.exit(1);
  }
}

validate();
```

---

## 📊 Validation Report Template

```markdown
# Validation Report

**Generated:** 2026-03-27T10:30:00Z

## Summary
- **Total Files:** 10
- **Passed:** 10 ✅
- **Failed:** 0 
- **Warnings:** 2 ⚠️
- **Issues:** 0 

---

## Detailed Results

### 01-getting-started.md
- **Size:** 0.15 MB
- **Words:** 8,234
- **Status:** ✅ Pass

**Warnings:**
- ⚠️ Less than 10K words

---

### 03-methods.md
- **Size:** 0.45 MB
- **Words:** 35,678
- **Status:** ✅ Pass

---
```

---

## ✅ Acceptance Criteria

- [ ] All NotebookLM files validated
- [ ] All semantic metadata validated
- [ ] All embeddings validated (1536 dimensions)
- [ ] Validation report generated
- [ ] Exit code 1 on failure
- [ ] Exit code 0 on success

---

## 🔗 Dependencies

- **Blocks:** `TASK-AI-RAG-001.6` (Testing)
- **Blocked by:** `TASK-AI-RAG-001.3` (NotebookLM), `TASK-AI-RAG-001.4` (Semantic)
- **Related:** `TASK-AI-RAG-001` (Parent)

---

## 📝 Notes

- Run validation before importing to NotebookLM
- Validation failures block deployment
- Report saved as `VALIDATION_REPORT.md`
- Integrate with CI/CD pipeline

---

**Created:** 2026-03-27  
**Status:** 🟡 Blocked (waiting for Phases 3 & 4)  
**Parent Task:** `TASK-AI-RAG-001`
