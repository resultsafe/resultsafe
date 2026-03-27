#!/usr/bin/env node

/**
 * Examples to Docusaurus Documentation Generator
 * 
 * Converts all examples from __examples__/ to Docusaurus documentation
 */

import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Paths
const EXAMPLES_DIR = path.join(__dirname, '../../packages/core/fp/result/__examples__');
const DOCS_DIR = path.join(__dirname, '../../docs/docs/examples');

// Ensure output directory exists
fs.mkdirSync(DOCS_DIR, { recursive: true });

// JSDoc parser
function parseJSDoc(content) {
  const jsdocRegex = /\/\*\*([\s\S]*?)\*\//;
  const match = content.match(jsdocRegex);
  
  if (!match) return null;
  
  const comment = match[1];
  
  // Extract tags
  const tags = {
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
    ai: extractTag(comment, 'ai'),
  };
  
  return tags;
}

function extractTag(comment, tagName) {
  const regex = new RegExp(`@${tagName}\\s+([^@*]+?)(?=@|\\*\\/|$)`, 's');
  const match = comment.match(regex);
  return match ? match[1].trim() : '';
}

// Generate Markdown from example
function generateMarkdown(filePath, content, jsdoc) {
  const relativePath = path.relative(EXAMPLES_DIR, filePath);
  const dirName = path.dirname(relativePath).replace(/\\/g, '/');
  
  // Extract code (everything after JSDoc)
  const code = content.replace(/\/\*\*[\s\S]*?\*\//, '').trim();
  
  return `---
id: ${path.basename(filePath, '.ts')}
title: ${jsdoc.title || 'Example'}
sidebar_label: ${jsdoc.title || 'Example'}
description: ${jsdoc.description || ''}
${jsdoc.tags ? `tags: [${jsdoc.tags.split(',').map(t => t.trim()).map(t => `'${t}'`).join(', ')}]` : ''}
${jsdoc.difficulty ? `difficulty: ${jsdoc.difficulty}` : ''}
${jsdoc.time ? `time: ${jsdoc.time}` : ''}
---

# ${jsdoc.title || 'Example'}

${jsdoc.description || ''}

## Source

This example is located at: \`packages/core/fp/result/__examples__/${relativePath}\`

${jsdoc.tags ? `
## Tags

${jsdoc.tags.split(',').map(t => `- ${t.trim()}`).join('\n')}
` : ''}

${jsdoc.example ? `
## Example

${jsdoc.example}
` : ''}

## Code

\`\`\`typescript
${code}
\`\`\`

## Related

${jsdoc.see ? jsdoc.see.split(' ').filter(s => s.startsWith('{@link')).map(s => s.replace('{@link ', '').replace('}', '')).map(link => `- [${link}](${linkToPath(link)})`).join('\n') : 'No related documentation'}

---

**Category:** ${jsdoc.category || 'examples'}  
**Since:** ${jsdoc.since || 'unknown'}  
${jsdoc.time ? `**Time:** ${jsdoc.time}\n` : ''}
`;
}

function linkToPath(link) {
  // Convert module name to path
  return `../${link.toLowerCase().replace(/\s+/g, '-')}`;
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
    
    fs.writeFileSync(
      path.join(docsCategoryPath, 'index.md'),
      categoryIndex
    );
    
    // Process subdirectories
    const subdirs = fs.readdirSync(categoryPath, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name);
    
    for (const subdir of subdirs) {
      const subdirPath = path.join(categoryPath, subdir);
      const exampleFile = path.join(subdirPath, 'example.ts');
      
      if (!fs.existsSync(exampleFile)) continue;
      
      total++;
      
      try {
        const content = fs.readFileSync(exampleFile, 'utf-8');
        const jsdoc = parseJSDoc(content);
        
        if (!jsdoc) {
          console.log(`  ⚠️  No JSDoc: ${subdir}/example.ts`);
          continue;
        }
        
        // Generate markdown
        const markdown = generateMarkdown(exampleFile, content, jsdoc);
        
        // Write to docs
        const docsFile = path.join(docsCategoryPath, `${subdir}.md`);
        fs.writeFileSync(docsFile, markdown);
        
        // Update category index
        const categoryIndexPath = path.join(docsCategoryPath, 'index.md');
        let categoryContent = fs.readFileSync(categoryIndexPath, 'utf-8');
        categoryContent += `- [${jsdoc.title || subdir}](${subdir}.md)\n`;
        fs.writeFileSync(categoryIndexPath, categoryContent);
        
        processed++;
        console.log(`  ✅ ${subdir}/example.ts`);
        
      } catch (error) {
        console.error(`  ❌ Error processing ${subdir}/example.ts:`, error.message);
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
