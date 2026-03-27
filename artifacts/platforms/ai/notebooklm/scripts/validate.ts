#!/usr/bin/env node
/**
 * Validation Script for AI/RAG Integration
 * 
 * Validates NotebookLM limits, semantic metadata, and embeddings.
 */

import { readdirSync, readFileSync, statSync, writeFileSync } from 'fs';

const LIMITS = {
  MAX_SOURCES: 50,
  MAX_FILE_SIZE_MB: 25,
  MAX_WORDS_PER_SOURCE: 500_000,
  MAX_TOTAL_STORAGE_MB: 500,
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
    
    if (sizeMB > LIMITS.MAX_FILE_SIZE_MB) {
      issues.push(`Size ${sizeMB.toFixed(2)}MB exceeds ${LIMITS.MAX_FILE_SIZE_MB}MB limit`);
    } else if (sizeMB > LIMITS.MAX_FILE_SIZE_MB * 0.9) {
      warnings.push(`Size approaching limit: ${sizeMB.toFixed(2)}MB`);
    }
    
    if (wordCount > LIMITS.MAX_WORDS_PER_SOURCE) {
      issues.push(`Word count ${wordCount.toLocaleString()} exceeds ${LIMITS.MAX_WORDS_PER_SOURCE.toLocaleString()} limit`);
    } else if (wordCount > LIMITS.MAX_WORDS_PER_SOURCE * 0.9) {
      warnings.push(`Word count approaching limit: ${wordCount.toLocaleString()}`);
    }
    
    if (wordCount < 1000) {
      warnings.push(`Less than 1000 words (may be too small)`);
    }
    
    results.push({ file, sizeMB, wordCount, issues, warnings, passed: issues.length === 0 });
  }
  
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
  
  return results;
}

function validateSemanticMetadata(): ValidationResult[] {
  const results: ValidationResult[] = [];
  
  try {
    const metadata = JSON.parse(readFileSync('../semantic/metadata.json', 'utf-8'));
    const embeddings = JSON.parse(readFileSync('../semantic/embeddings/embeddings.json', 'utf-8'));
    
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
  } catch (e: any) {
    results.push({
      file: 'semantic',
      sizeMB: 0,
      wordCount: 0,
      issues: [`Failed to load semantic files: ${e.message}`],
      warnings: [],
      passed: false
    });
  }
  
  return results;
}

function generateReport(results: ValidationResult[]): string {
  const totalFiles = results.length;
  const passed = results.filter(r => r.passed).length;
  const failed = totalFiles - passed;
  const totalWarnings = results.reduce((sum, r) => sum + r.warnings.length, 0);
  const totalIssues = results.reduce((sum, r) => sum + r.issues.length, 0);
  
  let report = `# Validation Report

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

function main() {
  console.log('🔍 Starting validation...\n');
  
  const notebookResults = validateNotebookLM();
  const semanticResults = validateSemanticMetadata();
  const allResults = [...notebookResults, ...semanticResults];
  
  const report = generateReport(allResults);
  writeFileSync('./VALIDATION_REPORT.md', report);
  
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

main();
