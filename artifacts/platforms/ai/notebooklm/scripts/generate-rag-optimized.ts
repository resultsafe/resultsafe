#!/usr/bin/env node
/**
 * NotebookLM RAG-Optimized Documentation Generator
 *
 * Converts JSDoc-documented examples into Question/Answer format
 * optimized for Google NotebookLM RAG system.
 */

import { parse } from 'comment-parser';
import { mkdirSync, readdirSync, readFileSync, writeFileSync } from 'fs';

const EXAMPLES_DIR =
  'E:/10-projects/lib/resultsafe/packages/core/fp/result/__examples__';
const OUTPUT_DIR =
  'E:/10-projects/lib/resultsafe/artifacts/platforms/ai/notebooklm/output';

interface RAGDoc {
  module: string;
  title: string;
  question: string;
  answer: string;
  description: string;
  code: string;
  tags: string[];
  category: string;
  difficulty: string;
  related: string[];
}

function parseExampleFile(filePath: string): RAGDoc | null {
  const content = readFileSync(filePath, 'utf-8');
  const comments = parse(content);

  const jsdoc = comments.find((c) => c.tags.some((t) => t.tag === 'module'));
  if (!jsdoc) return null;

  const getTag = (name: string) =>
    jsdoc.tags.find((t) => t.tag === name)?.description || '';

  const code = content.replace(/\/\*\*[\s\S]*?\*\//, '').trim();

  const description = getTag('description');
  const question = `How do I ${description.toLowerCase().split('.')[0]}?`;

  const functions =
    code.match(/\b(Ok|Err|match|map|andThen|unwrap|expect|tap|inspect)\b/g) ||
    [];
  const answer = `Use ${[...new Set(functions)].join(', ')} to handle this.`;

  // Extract category from folder structure
  const relativePath = filePath.replace(EXAMPLES_DIR + '/', '');
  const categoryFolder = relativePath.split('/')[0] || 'examples';

  return {
    module: getTag('module'),
    title: getTag('title') || 'Example',
    question,
    answer,
    description,
    code,
    tags: getTag('tags')
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean),
    category: categoryFolder,
    difficulty: getTag('difficulty') || 'intermediate',
    related: extractRelated(code),
  };
}

function extractRelated(code: string): string[] {
  const allFunctions = code.match(/\b[a-zA-Z]+\b/g) || [];
  const relevant = allFunctions.filter((f) =>
    [
      'Result',
      'Ok',
      'Err',
      'match',
      'map',
      'andThen',
      'unwrap',
      'expect',
    ].includes(f),
  );
  return [...new Set(relevant)];
}

function formatForNotebookLM(docs: RAGDoc[]): string {
  return docs
    .map((doc) =>
      `
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
${doc.related.map((f) => `- \`${f}\``).join('\n')}

## Related Concepts
${doc.related.map((r) => `- [[${r}]]`).join('\n')}

## Metadata
- **Tags:** ${doc.tags.join(', ')}
- **Difficulty:** ${doc.difficulty}
- **Module:** ${doc.module}
`.trim(),
    )
    .join('\n\n---\n\n');
}

function generateWhenToUse(category: string): string {
  const templates: Record<string, string> = {
    constructors: 'When creating new Result values',
    guards: 'When checking Result type at runtime',
    methods: 'When transforming or chaining Result operations',
    patterns: 'When implementing common error handling patterns',
    async: 'When working with async operations and promises',
  };
  return templates[category] || 'When working with Result types';
}

const CATEGORY_MAPPING: Record<string, string> = {
  '00-quick-start': '01-getting-started',
  '01-api-reference': '02-core-concepts',
  '02-patterns': '07-real-world',
};

const OUTPUT_FILES: Record<string, string> = {
  '01-getting-started': 'Getting Started with ResultSafe',
  '02-core-concepts': 'Core Concepts: Ok, Err, Result',
  '03-methods': 'Methods: Transformation and Chaining',
  '04-guards': 'Guards: Type Narrowing',
  '05-error-handling': 'Error Handling Patterns',
  '06-async-patterns': 'Async/Await Patterns',
  '07-real-world': 'Real-World Production Patterns',
  '08-api-quick-reference': 'API Quick Reference',
};

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
  console.log('🔄 Generating NotebookLM RAG documentation...\n');

  mkdirSync(OUTPUT_DIR, { recursive: true });

  const files = getAllExampleFiles(EXAMPLES_DIR);
  console.log(`📁 Found ${files.length} example files\n`);

  const docs: RAGDoc[] = [];
  for (const file of files) {
    const doc = parseExampleFile(file);
    if (doc) docs.push(doc);
  }

  console.log(`✅ Parsed ${docs.length} examples\n`);

  // Group by category
  const grouped: Record<string, RAGDoc[]> = {};
  for (const doc of docs) {
    const category =
      CATEGORY_MAPPING[doc.category.split('/')[0]] || '08-api-quick-reference';
    if (!grouped[category]) grouped[category] = [];
    grouped[category].push(doc);
  }

  // Generate files
  for (const [fileKey, fileDocs] of Object.entries(grouped)) {
    const title = OUTPUT_FILES[fileKey] || fileKey;
    const content = `# ${title}\n\n${formatForNotebookLM(fileDocs)}`;

    writeFileSync(`${OUTPUT_DIR}/${fileKey}.md`, content);
    console.log(`✅ Generated ${fileKey}.md (${fileDocs.length} docs)`);
  }

  console.log(
    `\n🎉 Generated ${Object.keys(grouped).length} files in ${OUTPUT_DIR}`,
  );
}

main();
