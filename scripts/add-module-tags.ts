#!/usr/bin/env node
/**
 * Add @module JSDoc tags to all examples
 * 
 * Scans __examples__ directory and adds missing @module, @title, @description tags
 */

import { readFileSync, writeFileSync, readdirSync } from 'fs';
import { join } from 'path';

const EXAMPLES_DIR = 'E:/10-projects/lib/resultsafe/packages/core/fp/result/__examples__';

interface ExampleFile {
  path: string;
  content: string;
  hasModule: boolean;
  hasTitle: boolean;
  hasDescription: boolean;
  folderName: string;
  categoryName: string;
}

function getAllExampleFiles(dir: string): ExampleFile[] {
  const files: ExampleFile[] = [];
  
  function walk(current: string) {
    const entries = readdirSync(current, { withFileTypes: true });
    for (const e of entries) {
      const path = `${current}/${e.name}`;
      if (e.isDirectory()) {
        walk(path);
      } else if (e.name === 'example.ts') {
        const content = readFileSync(path, 'utf-8');
        const hasModule = /@module\s+/.test(content);
        const hasTitle = /@title\s+/.test(content);
        const hasDescription = /@description\s+/.test(content);
        
        // Extract folder names for module name generation
        const relativePath = path.replace(EXAMPLES_DIR + '/', '');
        const parts = relativePath.split('/');
        const categoryName = parts[0] || 'examples';
        const folderName = parts[parts.length - 2] || 'example';
        
        files.push({
          path,
          content,
          hasModule,
          hasTitle,
          hasDescription,
          folderName,
          categoryName
        });
      }
    }
  }
  
  walk(dir);
  return files;
}

function generateModuleTags(file: ExampleFile): { module: string; title: string; description: string } {
  // Generate module name from folder structure
  const moduleName = file.folderName.replace(/-/g, ' ');
  
  // Generate title from module name
  const title = moduleName
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
  
  // Generate description based on category
  const descriptions: Record<string, string> = {
    '00-quick-start': 'Quick start example demonstrating basic usage',
    '01-api-reference': 'API reference example showing constructor/method usage',
    '02-patterns': 'Real-world pattern implementation example',
    '03-integrations': 'Third-party integration example',
    '04-real-world': 'Production-ready implementation example'
  };
  
  const description = descriptions[file.categoryName] || 'Example demonstrating Result type usage';
  
  return { module: file.folderName, title, description };
}

function addJSDocTags(file: ExampleFile): string {
  const { module, title, description } = generateModuleTags(file);
  
  // Check if file already has JSDoc
  const jsdocMatch = file.content.match(/\/\*\*([\s\S]*?)\*\//);
  
  if (!jsdocMatch) {
    // No JSDoc at all - add complete JSDoc block
    const jsdoc = `/**
 * @module ${module}
 * @title ${title}
 * @description ${description}
 * @example
 * // See code below
 * @since 0.2.1
 * @difficulty Intermediate
 * @time 10min
 * @category ${file.categoryName}
 */

`;
    return jsdoc + file.content;
  }
  
  // Has JSDoc - add missing tags
  let jsdoc = jsdocMatch[0];
  let needsUpdate = false;
  
  if (!file.hasModule) {
    jsdoc = jsdoc.replace(/(\*\/)/, ` * @module ${module}\n * @since 0.2.1\n$1`);
    needsUpdate = true;
  }
  
  if (!file.hasTitle) {
    jsdoc = jsdoc.replace(/(\*\/)/, ` * @title ${title}\n$1`);
    needsUpdate = true;
  }
  
  if (!file.hasDescription) {
    jsdoc = jsdoc.replace(/(\*\/)/, ` * @description ${description}\n$1`);
    needsUpdate = true;
  }
  
  if (needsUpdate) {
    return file.content.replace(/\/\*\*[\s\S]*?\*\//, jsdoc);
  }
  
  return file.content;
}

function main() {
  console.log('🔍 Scanning examples for missing @module tags...\n');
  
  const files = getAllExampleFiles(EXAMPLES_DIR);
  console.log(`📁 Found ${files.length} example files\n`);
  
  const missingModule = files.filter(f => !f.hasModule);
  const missingTitle = files.filter(f => !f.hasTitle);
  const missingDescription = files.filter(f => !f.hasDescription);
  
  console.log(`Missing @module: ${missingModule.length}`);
  console.log(`Missing @title: ${missingTitle.length}`);
  console.log(`Missing @description: ${missingDescription.length}\n`);
  
  if (missingModule.length === 0 && missingTitle.length === 0 && missingDescription.length === 0) {
    console.log('✅ All examples have complete JSDoc!');
    return;
  }
  
  console.log('🔄 Adding missing tags...\n');
  
  let updated = 0;
  for (const file of files) {
    if (!file.hasModule || !file.hasTitle || !file.hasDescription) {
      const newContent = addJSDocTags(file);
      if (newContent !== file.content) {
        writeFileSync(file.path, newContent, 'utf-8');
        console.log(`✅ Updated: ${file.path.replace(EXAMPLES_DIR + '/', '')}`);
        updated++;
      }
    }
  }
  
  console.log(`\n🎉 Updated ${updated} files with missing JSDoc tags`);
}

main();
