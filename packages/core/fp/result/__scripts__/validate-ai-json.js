#!/usr/bin/env node

/**
 * AI JSDoc JSON Validator
 *
 * Validates @ai JSON structure in all example files
 */

import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const EXAMPLES_DIR = path.join(__dirname, '..');
const AI_TAG_REGEX = /@ai\s*\{([\s\S]*?)\}\s*(?=\n\s*\*\s*@|\n\s*\*\/)/;

const REQUIRED_FIELDS = [
  'purpose',
  'prerequisites',
  'objectives',
  'rag',
  'embedding',
  'codeSearch',
  'learningPath',
  'chunking',
];

const RAG_REQUIRED = ['queries', 'intents', 'expectedAnswer', 'confidence'];
const EMBEDDING_REQUIRED = ['semanticKeywords', 'conceptualTags', 'useCases'];
const CODE_SEARCH_REQUIRED = ['patterns', 'imports'];
const LEARNING_PATH_REQUIRED = ['progression'];
const CHUNKING_REQUIRED = ['type', 'section', 'tokenCount', 'relatedChunks'];

let validCount = 0;
let invalidCount = 0;
let skippedCount = 0;

function validateAiJson(filePath, content) {
  const match = content.match(AI_TAG_REGEX);

  if (!match) {
    // Check if file has @module but no @ai - might be quick-start
    const hasModule = /@module\s+/.test(content);
    if (hasModule) {
      console.error(
        `❌ ${path.relative(EXAMPLES_DIR, filePath)}: Missing @ai tag`,
      );
      return false;
    }
    return true; // No @module, skip
  }

  try {
    // Extract JSON - everything after @ai { until closing }
    let jsonStr = match[1].trim();

    // Remove newlines and extra spaces
    jsonStr = jsonStr.replace(/\s+/g, ' ').trim();

    // Parse JSON
    const json = JSON.parse(`{${jsonStr}}`);

    // Validate required fields
    for (const field of REQUIRED_FIELDS) {
      if (!(field in json)) {
        console.error(
          `❌ ${path.relative(EXAMPLES_DIR, filePath)}: Missing @ai.${field}`,
        );
        return false;
      }
    }

    // Validate nested structures
    if (json.rag) {
      for (const field of RAG_REQUIRED) {
        if (!(field in json.rag)) {
          console.error(
            `❌ ${path.relative(EXAMPLES_DIR, filePath)}: Missing @ai.rag.${field}`,
          );
          return false;
        }
      }
    }

    if (json.embedding) {
      for (const field of EMBEDDING_REQUIRED) {
        if (!(field in json.embedding)) {
          console.error(
            `❌ ${path.relative(EXAMPLES_DIR, filePath)}: Missing @ai.embedding.${field}`,
          );
          return false;
        }
      }
    }

    if (json.codeSearch) {
      for (const field of CODE_SEARCH_REQUIRED) {
        if (!(field in json.codeSearch)) {
          console.error(
            `❌ ${path.relative(EXAMPLES_DIR, filePath)}: Missing @ai.codeSearch.${field}`,
          );
          return false;
        }
      }
    }

    if (json.learningPath) {
      for (const field of LEARNING_PATH_REQUIRED) {
        if (!(field in json.learningPath)) {
          console.error(
            `❌ ${path.relative(EXAMPLES_DIR, filePath)}: Missing @ai.learningPath.${field}`,
          );
          return false;
        }
      }
    }

    if (json.chunking) {
      for (const field of CHUNKING_REQUIRED) {
        if (!(field in json.chunking)) {
          console.error(
            `❌ ${path.relative(EXAMPLES_DIR, filePath)}: Missing @ai.chunking.${field}`,
          );
          return false;
        }
      }
    }

    // Validate confidence score range
    if (json.rag && json.rag.confidence !== undefined) {
      const confidence = json.rag.confidence;
      if (typeof confidence !== 'number' || confidence < 0 || confidence > 1) {
        console.error(
          `❌ ${path.relative(EXAMPLES_DIR, filePath)}: @ai.rag.confidence must be number between 0 and 1`,
        );
        return false;
      }
    }

    // Validate types
    if (!Array.isArray(json.prerequisites)) {
      console.error(
        `❌ ${path.relative(EXAMPLES_DIR, filePath)}: @ai.prerequisites must be array`,
      );
      return false;
    }

    if (!Array.isArray(json.objectives)) {
      console.error(
        `❌ ${path.relative(EXAMPLES_DIR, filePath)}: @ai.objectives must be array`,
      );
      return false;
    }

    if (typeof json.purpose !== 'string') {
      console.error(
        `❌ ${path.relative(EXAMPLES_DIR, filePath)}: @ai.purpose must be string`,
      );
      return false;
    }

    // Backward compatibility: allow old chunkHint format during migration
    if (json.chunkHint && typeof json.chunkHint !== 'string') {
      console.warn(
        `⚠️  ${path.relative(EXAMPLES_DIR, filePath)}: @ai.chunkHint is deprecated, use @ai.chunking`,
      );
    }

    console.log(`✅ ${path.relative(EXAMPLES_DIR, filePath)}: Valid @ai JSON`);
    return true;
  } catch (error) {
    console.error(
      `❌ ${path.relative(EXAMPLES_DIR, filePath)}: Invalid @ai JSON - ${error.message}`,
    );
    return false;
  }
}

function walk(dir) {
  const files = fs.readdirSync(dir);

  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      // Skip non-example directories
      if (
        file === 'node_modules' ||
        file.startsWith('.') ||
        file === 'config' ||
        file === 'dist'
      ) {
        continue;
      }
      walk(fullPath);
    } else if (file.endsWith('.ts')) {
      const content = fs.readFileSync(fullPath, 'utf-8');

      // Check if file has @module tag (indicates it should have @ai)
      const hasModule = /@module\s+/.test(content);

      if (hasModule) {
        const isValid = validateAiJson(fullPath, content);
        if (isValid) {
          validCount++;
        } else {
          invalidCount++;
        }
      } else {
        skippedCount++;
      }
    }
  }
}

console.log('🔍 Validating AI JSDoc JSON in examples...\n');

walk(EXAMPLES_DIR);

console.log('\n' + '='.repeat(50));
console.log(`✅ Valid: ${validCount}`);
console.log(`❌ Invalid: ${invalidCount}`);
console.log(`⏭️  Skipped (no @module): ${skippedCount}`);
console.log('='.repeat(50));

if (invalidCount > 0) {
  console.log('\n❌ Validation failed!');
  process.exit(1);
} else {
  console.log('\n✅ All examples have valid @ai JSON!');
  process.exit(0);
}
