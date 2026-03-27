#!/usr/bin/env node
/**
 * Semantic Metadata Generator
 * 
 * Extracts keywords and generates vector-optimized text
 * for embeddings and semantic search.
 */

import { readFileSync, writeFileSync, mkdirSync, readdirSync } from 'fs';
import { parse } from 'comment-parser';

const EXAMPLES_DIR = '../../../../packages/core/fp/result/__examples__';
const OUTPUT_DIR = '.';

interface SemanticMetadata {
  id: string;
  title: string;
  description: string;
  keywords: string[];
  category: string;
  difficulty: string;
  code_snippet: string;
  related_ids: string[];
  vector_text: string;
}

function extractKeywords(text: string, code: string): string[] {
  const descWords = text.toLowerCase().match(/\b[a-z]{4,}\b/g) || [];
  const codeWords = code.replace(/\/\/.*$/gm, '').match(/\b[a-zA-Z]{4,}\b/g) || [];
  const all = [...new Set([...descWords, ...codeWords])];
  return all.filter(w => w.length > 3).slice(0, 20);
}

function generateVectorText(example: any): string {
  return `
${example.title}

${example.description}

Category: ${example.category}
Difficulty: ${example.difficulty}
Tags: ${example.tags.join(', ')}

Example code uses: ${extractFunctions(example.code).join(', ')}

When to use: ${generateWhenToUse(example.category)}

Related to: ${example.related.join(', ')}

Key concepts: ${example.keywords.join(', ')}
`.trim();
}

function extractFunctions(code: string): string[] {
  const regex = /\b(Ok|Err|match|map|mapErr|andThen|orElse|unwrap|unwrapOr|expect|tap|inspect)\b/g;
  return [...new Set(code.match(regex) || [])];
}

function generateWhenToUse(category: string): string {
  const templates: Record<string, string> = {
    'constructors': 'When creating new Result values',
    'guards': 'When checking Result type at runtime',
    'methods': 'When transforming or chaining Result operations',
    'patterns': 'When implementing common error handling patterns',
    'async': 'When working with async operations and promises'
  };
  return templates[category] || 'When working with Result types';
}

function findRelated(current: any, allExamples: any[]): string[] {
  const currentKeywords = new Set(current.keywords);
  return allExamples
    .filter((ex: any) => ex.id !== current.id)
    .map((ex: any) => ({
      id: ex.id,
      similarity: calculateSimilarity(currentKeywords, new Set(ex.keywords))
    }))
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, 5)
    .map(r => r.id);
}

function calculateSimilarity(set1: Set<string>, set2: Set<string>): number {
  const intersection = [...set1].filter(x => set2.has(x)).length;
  const union = new Set([...set1, ...set2]).size;
  return intersection / union;
}

function parseExampleFile(filePath: string): any {
  const content = readFileSync(filePath, 'utf-8');
  const comments = parse(content);
  const jsdoc = comments.find(c => c.tags.some(t => t.tag === 'module'));
  
  if (!jsdoc) return null;
  
  const getTag = (name: string) => 
    jsdoc.tags.find(t => t.tag === name)?.description || '';
  
  const code = content.replace(/\/\*\*[\s\S]*?\*\//, '').trim();
  
  return {
    id: getTag('module'),
    title: getTag('title') || 'Example',
    description: getTag('description'),
    tags: getTag('tags').split(',').map(t => t.trim()).filter(Boolean),
    category: getTag('category') || 'examples',
    difficulty: getTag('difficulty') || 'intermediate',
    code,
    keywords: [] as string[],
    related: [] as string[],
    vector_text: ''
  };
}

function getAllExampleFiles(dir: string): string[] {
  const files: string[] = [];
  function walk(current: string) {
    const entries = readdirSync(current, { withFileTypes: true });
    for (const e of entries) {
      const path = `${current}/${e.name}`;
      if (e.isDirectory()) walk(path);
      else if (e.name === 'example.ts') files.push(path);
    }
  }
  walk(dir);
  return files;
}

function main() {
  console.log('🔄 Generating semantic metadata...\n');
  
  mkdirSync(`${OUTPUT_DIR}/chunks`, { recursive: true });
  mkdirSync(`${OUTPUT_DIR}/embeddings`, { recursive: true });
  
  const files = getAllExampleFiles(EXAMPLES_DIR);
  console.log(`📁 Found ${files.length} example files\n`);
  
  const examples = files.map(f => parseExampleFile(f)).filter(Boolean);
  console.log(`✅ Parsed ${examples.length} examples\n`);
  
  // Extract keywords
  for (const ex of examples) {
    ex.keywords = extractKeywords(ex.description, ex.code);
  }
  
  // Find related
  for (const ex of examples) {
    ex.related = findRelated(ex, examples);
  }
  
  // Generate metadata
  const metadata: SemanticMetadata[] = examples.map(ex => ({
    id: ex.id,
    title: ex.title,
    description: ex.description,
    keywords: ex.keywords,
    category: ex.category,
    difficulty: ex.difficulty,
    code_snippet: ex.code,
    related_ids: ex.related,
    vector_text: generateVectorText(ex)
  }));
  
  writeFileSync(`${OUTPUT_DIR}/metadata.json`, JSON.stringify(metadata, null, 2));
  console.log(`✅ Generated metadata.json (${metadata.length} entries)`);
  
  // Generate chunks
  const chunks = metadata.map(m => ({
    id: m.id,
    text: m.vector_text,
    metadata: {
      title: m.title,
      category: m.category,
      keywords: m.keywords,
      source_file: `packages/core/fp/result/__examples__/${m.id}/example.ts`
    }
  }));
  
  writeFileSync(`${OUTPUT_DIR}/chunks/chunks.json`, JSON.stringify(chunks, null, 2));
  console.log(`✅ Generated chunks/chunks.json (${chunks.length} chunks)`);
  
  // Generate pseudo-embeddings
  const embeddings = chunks.map(chunk => ({
    id: chunk.id,
    vector: generatePseudoVector(chunk.text),
    metadata: chunk.metadata
  }));
  
  writeFileSync(`${OUTPUT_DIR}/embeddings/embeddings.json`, JSON.stringify(embeddings, null, 2));
  console.log(`✅ Generated embeddings/embeddings.json (${embeddings.length} embeddings)`);
  
  console.log(`\n🎉 Semantic metadata generation complete!`);
}

function generatePseudoVector(text: string): number[] {
  const hash = text.split('').reduce((a, b) => {
    const h = a * 31 + b.charCodeAt(0);
    return Math.imul(h, h);
  }, 0x811c9dc5);
  
  return Array(1536).fill(0).map((_, i) => 
    Math.sin(hash * (i + 1)) * Math.cos(hash * (i + 1))
  );
}

main();
