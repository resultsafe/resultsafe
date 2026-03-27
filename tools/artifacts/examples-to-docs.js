#!/usr/bin/env node

/**
 * Examples to Docusaurus Documentation Generator
 */

const fs = require('fs');
const path = require('path');

const EXAMPLES_DIR = path.join(
  __dirname,
  '../../packages/core/fp/result/__examples__',
);
const DOCS_DIR = path.join(__dirname, '../../docs/docs/examples');

fs.mkdirSync(DOCS_DIR, { recursive: true });

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
  };
}

function extractTag(comment, tagName) {
  const regex = new RegExp(`@${tagName}\\s+([^@*]+?)(?=@|\\*\\/|$)`, 's');
  const match = comment.match(regex);
  return match ? match[1].trim() : '';
}

function generateMarkdown(filePath, content, jsdoc) {
  const relativePath = path.relative(EXAMPLES_DIR, filePath);
  const code = content.replace(/\/\*\*[\s\S]*?\*\//, '').trim();

  return `---
id: ${path.basename(filePath, '.ts')}
title: ${jsdoc.title || 'Example'}
sidebar_label: ${jsdoc.title || 'Example'}
description: ${jsdoc.description || 'Code example demonstrating usage'}
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

\`packages/core/fp/result/__examples__/${relativePath.replace(/\\/g, '/')}\`

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

**Category:** ${jsdoc.category || 'examples'} | **Since:** ${jsdoc.since || 'unknown'}
`;
}

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

  // Create main index
  const mainIndex = `---
id: examples
title: Examples
sidebar_label: Examples
description: All 51 examples from ResultSafe library
---

# Examples

**51 examples** automatically generated from \`packages/core/fp/result/__examples__\`.

## Categories

| Category | Examples | Description |
|----------|----------|-------------|
| [Quick Start](./00-quick-start/index.md) | 4 | Get started in minutes |
| [API Reference](./01-api-reference/index.md) | 38 | Complete API with examples |
| [Patterns](./02-patterns/index.md) | 9 | Real-world patterns |

---

**Generated:** ${new Date().toISOString().split('T')[0]}
`;
  fs.writeFileSync(path.join(DOCS_DIR, 'index.md'), mainIndex);

  for (const [categoryDir, categoryName] of Object.entries(categories)) {
    const categoryPath = path.join(EXAMPLES_DIR, categoryDir);

    if (!fs.existsSync(categoryPath)) {
      console.log(`⏭️  Skipping ${categoryName} (not found)`);
      continue;
    }

    console.log(`📁 Processing ${categoryName}...`);

    const docsCategoryPath = path.join(DOCS_DIR, categoryDir);
    fs.mkdirSync(docsCategoryPath, { recursive: true });

    // Collect examples for index
    const examplesList = [];

    // Find all example.ts files recursively
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

        const markdown = generateMarkdown(exampleFile, content, jsdoc);

        const relativePath = path.relative(
          categoryPath,
          path.dirname(exampleFile),
        );
        const docsSubdir = path.join(docsCategoryPath, relativePath);
        fs.mkdirSync(docsSubdir, { recursive: true });

        const docsFile = path.join(
          docsSubdir,
          `${path.basename(exampleFile, '.ts')}.md`,
        );
        fs.writeFileSync(docsFile, markdown);

        const docRelativePath = path
          .relative(docsCategoryPath, docsFile)
          .replace(/\\/g, '/');
        examplesList.push(
          `- [${jsdoc.title || path.basename(exampleFile, '.ts')}](${docRelativePath})`,
        );

        processed++;
        console.log(`  ✅ ${path.relative(EXAMPLES_DIR, exampleFile)}`);
      } catch (error) {
        console.error(`  ❌ Error:`, error.message);
      }
    }

    // Write category index
    const categoryIndex = `---
id: ${categoryDir}
title: ${categoryName}
sidebar_label: ${categoryName}
---

# ${categoryName}

**${examplesList.length} examples** from \`packages/core/fp/result/__examples__/${categoryDir}\`.

## Examples

${examplesList.join('\n')}

---

**Total:** ${examplesList.length} examples
`;
    fs.writeFileSync(path.join(docsCategoryPath, 'index.md'), categoryIndex);

    console.log();
  }

  console.log('='.repeat(50));
  console.log(`✅ Processed: ${processed}/${total} examples`);
  console.log(`📁 Output: ${DOCS_DIR}`);
  console.log('='.repeat(50));
}

processExamples();
