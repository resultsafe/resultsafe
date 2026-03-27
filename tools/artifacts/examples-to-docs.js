#!/usr/bin/env node

/**
 * Examples to Docusaurus Documentation Generator
 *
 * Converts all examples from __examples__/ to Docusaurus documentation
 */

const fs = require('fs');
const path = require('path');

// Paths
const EXAMPLES_DIR = path.join(
  __dirname,
  '../../packages/core/fp/result/__examples__',
);
const DOCS_DIR = path.join(__dirname, '../../docs/docs/examples');

// Ensure output directory exists
fs.mkdirSync(DOCS_DIR, { recursive: true });

// JSDoc parser
function parseJSDoc(content) {
  const jsdocRegex = /\/\*\*([\s\S]*?)\*\//;
  const match = content.match(jsdocRegex);

  if (!match) return null;

  const comment = match[1];

  return {
    module: extractTag(comment, 'module'),
    title: extractTag(comment, 'title'),
    description: extractTag(comment, 'description'),
    example: extractTag(comment, 'example'),
    tags: extractTag(comment, 'tags'),
    since: extractTag(comment, 'since'),
    difficulty: extractTag(comment, 'difficulty'),
    time: extractTag(comment, 'time'),
    category: extractTag(comment, 'category'),
    see: extractTag(comment, 'see'),
  };
}

function extractTag(comment, tagName) {
  const regex = new RegExp(`@${tagName}\\s+([^@*]+?)(?=@|\\*\\/|$)`, 's');
  const match = comment.match(regex);
  return match ? match[1].trim() : '';
}

// Generate Markdown from example
function generateMarkdown(filePath, content, jsdoc) {
  const relativePath = path.relative(EXAMPLES_DIR, filePath);

  // Extract code (everything after JSDoc)
  const code = content.replace(/\/\*\*[\s\S]*?\*\//, '').trim();

  return `---
id: ${path.basename(filePath, '.ts')}
title: ${jsdoc.title || 'Example'}
sidebar_label: ${jsdoc.title || 'Example'}
description: ${jsdoc.description || ''}
${
  jsdoc.tags
    ? `tags: [${jsdoc.tags
        .split(',')
        .map((t) => t.trim())
        .map((t) => `'${t}'`)
        .join(', ')}]`
    : ''
}
${jsdoc.difficulty ? `difficulty: ${jsdoc.difficulty}` : ''}
${jsdoc.time ? `time: ${jsdoc.time}` : ''}
---

# ${jsdoc.title || 'Example'}

${jsdoc.description || ''}

## Source

This example is located at: \`packages/core/fp/result/__examples__/${relativePath.replace(/\\/g, '/')}\`

${
  jsdoc.tags
    ? `
## Tags

${jsdoc.tags
  .split(',')
  .map((t) => `- ${t.trim()}`)
  .join('\n')}
`
    : ''
}

${
  jsdoc.example
    ? `
## Example

${jsdoc.example}
`
    : ''
}

## Code

\`\`\`typescript
${code}
\`\`\`

---

**Category:** ${jsdoc.category || 'examples'}  
**Since:** ${jsdoc.since || 'unknown'}  
${jsdoc.time ? `**Time:** ${jsdoc.time}\n` : ''}
`;
}

// Process all example files
function processExamples() {
  console.log('🔍 Processing examples...\n');

  const categories = {
    '00-quick-start': 'Quick Start',
    '01-api-reference': 'API Reference',
    '02-patterns': 'Patterns',
    '03-integrations': 'Integrations',
    '04-real-world': 'Real World',
  };

  let total = 0;
  let processed = 0;

  for (const [categoryDir, categoryName] of Object.entries(categories)) {
    const categoryPath = path.join(EXAMPLES_DIR, categoryDir);

    if (!fs.existsSync(categoryPath)) {
      console.log(`⏭️  Skipping ${categoryName} (not found)`);
      continue;
    }

    console.log(`📁 Processing ${categoryName}...`);

    // Create category directory
    const docsCategoryPath = path.join(DOCS_DIR, categoryDir);
    fs.mkdirSync(docsCategoryPath, { recursive: true });

    // Create category index
    const categoryIndex = `---
id: ${categoryDir}
title: ${categoryName}
sidebar_label: ${categoryName}
---

# ${categoryName}

Examples in this category are automatically generated from \`packages/core/fp/result/__examples__/${categoryDir}\`.

## Available Examples

<!-- AUTO-GENERATED LIST -->

`;

    // Recursively find all example.ts files
    function findExampleFiles(dir) {
      let files = [];
      const entries = fs.readdirSync(dir, { withFileTypes: true });

      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
          files = files.concat(findExampleFiles(fullPath));
        } else if (entry.isFile() && entry.name === 'example.ts') {
          files.push(fullPath);
        }
      }

      return files;
    }

    const exampleFiles = findExampleFiles(categoryPath);

    for (const exampleFile of exampleFiles) {
      total++;

      try {
        const content = fs.readFileSync(exampleFile, 'utf-8');
        const jsdoc = parseJSDoc(content);

        if (!jsdoc) {
          console.log(
            `  ⚠️  No JSDoc: ${path.relative(EXAMPLES_DIR, exampleFile)}`,
          );
          continue;
        }

        // Generate markdown
        const markdown = generateMarkdown(exampleFile, content, jsdoc);

        // Create relative path for docs file
        const relativePath = path.relative(
          categoryPath,
          path.dirname(exampleFile),
        );
        const docsSubdir = path.join(docsCategoryPath, relativePath);
        fs.mkdirSync(docsSubdir, { recursive: true });

        // Write to docs
        const docsFile = path.join(
          docsSubdir,
          `${path.basename(exampleFile, '.ts')}.md`,
        );
        fs.writeFileSync(docsFile, markdown);

        // Update category index
        const categoryIndexPath = path.join(docsCategoryPath, 'index.md');
        let categoryContent = fs.readFileSync(categoryIndexPath, 'utf-8');
        const docRelativePath = path
          .relative(docsCategoryPath, docsFile)
          .replace(/\\/g, '/');
        categoryContent += `- [${jsdoc.title || path.basename(exampleFile, '.ts')}](${docRelativePath})\n`;
        fs.writeFileSync(categoryIndexPath, categoryContent);

        processed++;
        console.log(`  ✅ ${path.relative(EXAMPLES_DIR, exampleFile)}`);
      } catch (error) {
        console.error(`  ❌ Error:`, error.message);
      }
    }

    console.log();
  }

  console.log('='.repeat(50));
  console.log(`✅ Processed: ${processed}/${total} examples`);
  console.log(`📁 Output: ${DOCS_DIR}`);
  console.log('='.repeat(50));
}

// Run
processExamples();
