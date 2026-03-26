/**
 * Migration script: Add @since tags to all exports
 * 
 * Usage: node scripts/migrate-since-tags.mjs [--dry-run]
 */

import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import { resolve, extname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = fileURLToPath(new URL('.', import.meta.url));

const DRY_RUN = process.argv.includes('--dry-run');
const PACKAGE_ROOT = resolve(__dirname, '../packages/core/fp/result');
const PACKAGE_VERSION = '0.1.8'; // Next version

/**
 * Find all TypeScript files in src/
 */
function findTsFiles(dir, files = []) {
  const entries = readdirSync(dir);
  
  for (const entry of entries) {
    if (entry.startsWith('.') || entry === 'node_modules') continue;
    
    const fullPath = resolve(dir, entry);
    const stat = statSync(fullPath);
    
    if (stat.isDirectory()) {
      findTsFiles(fullPath, files);
    } else if (extname(entry) === '.ts' && !entry.includes('.test.') && !entry.includes('.d.ts')) {
      files.push(fullPath);
    }
  }
  
  return files;
}

/**
 * Check if file has exports
 */
function hasExports(content) {
  return /^\s*export\s+(type|const|function|class|interface|enum)/m.test(content);
}

/**
 * Add @since tag to JSDoc comment
 */
function addSinceToJsDoc(content, version) {
  const lines = content.split('\n');
  const result = [];
  let inJsDoc = false;
  let jsDocStart = -1;
  let exportFound = false;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // Start of JSDoc
    if (line.trim().startsWith('/**')) {
      inJsDoc = true;
      jsDocStart = i;
      result.push(line);
      continue;
    }
    
    // End of JSDoc
    if (inJsDoc && line.trim().endsWith('*/')) {
      result.push(line);
      inJsDoc = false;
      
      // Check if next non-empty line is an export
      let j = i + 1;
      while (j < lines.length && lines[j].trim() === '') {
        j++;
      }
      
      if (j < lines.length && /^\s*export\s+(type|const|function|class|interface|enum)/.test(lines[j])) {
        // Check if @since already exists
        const hasSince = lines.slice(jsDocStart, i + 1).some(l => l.includes('@since'));
        
        if (!hasSince) {
          // Find position to insert @since (before @public or before */)
          let insertPos = i;
          for (let k = jsDocStart; k <= i; k++) {
            if (lines[k].includes('@public') || lines[k].includes('@internal')) {
              insertPos = k;
              break;
            }
          }
          
          // Insert @since
          const indent = lines[insertPos].match(/^(\s*)/)[1];
          const sinceLine = `${indent}* @since ${version}`;
          
          if (insertPos === i) {
            // Insert before closing */
            result.splice(result.length - 1, 0, sinceLine);
          } else {
            // Insert before @public/@internal
            const offset = insertPos - jsDocStart;
            result.splice(offset + 1, 0, sinceLine);
          }
        }
      }
      continue;
    }
    
    result.push(line);
  }
  
  return result.join('\n');
}

/**
 * Process a single file
 */
function processFile(filePath) {
  const content = readFileSync(filePath, 'utf8');
  
  if (!hasExports(content)) {
    return { changed: false, reason: 'no exports' };
  }
  
  const newContent = addSinceToJsDoc(content, PACKAGE_VERSION);
  
  if (newContent === content) {
    return { changed: false, reason: 'all @since present' };
  }
  
  if (!DRY_RUN) {
    writeFileSync(filePath, newContent, 'utf8');
  }
  
  return { changed: true };
}

// Main
console.log(`🔍 Scanning for TypeScript files in ${PACKAGE_ROOT}/src...`);
console.log(`📦 Package version: ${PACKAGE_VERSION}`);
console.log(`💧 Dry run: ${DRY_RUN ? 'YES' : 'NO'}`);
console.log('');

const files = findTsFiles(resolve(PACKAGE_ROOT, 'src'));
console.log(`Found ${files.length} TypeScript files\n`);

let changed = 0;
let unchanged = 0;
const results = [];

for (const file of files) {
  const result = processFile(file);
  
  if (result.changed) {
    changed++;
    results.push(`✅ ${file.replace(PACKAGE_ROOT, '')}`);
  } else {
    unchanged++;
    results.push(`⏭️  ${file.replace(PACKAGE_ROOT, '')} (${result.reason})`);
  }
}

console.log('Results:');
results.forEach(r => console.log(r));

console.log('');
console.log(`Summary:`);
console.log(`  Changed:   ${changed}`);
console.log(`  Unchanged: ${unchanged}`);
console.log(`  Total:     ${files.length}`);

if (DRY_RUN) {
  console.log('\n💡 Run without --dry-run to apply changes');
} else {
  console.log('\n✅ Migration complete!');
}
