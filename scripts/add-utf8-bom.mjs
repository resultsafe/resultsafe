/**
 * Add UTF-8 BOM to all Markdown files
 * 
 * This ensures proper encoding display on unpkg and npm
 */

import { readdirSync, readFileSync, writeFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

const UTF8_BOM = Buffer.from([0xEF, 0xBB, 0xBF]);

/**
 * Recursively add BOM to all .md files in directory
 * @param {string} dir - Directory to process
 */
function addBomToMarkdownFiles(dir) {
  const entries = readdirSync(dir, { withFileTypes: true });
  
  for (const entry of entries) {
    const fullPath = join(dir, entry.name);
    
    if (entry.isDirectory()) {
      addBomToMarkdownFiles(fullPath);
    } else if (entry.isFile() && entry.name.endsWith('.md')) {
      const content = readFileSync(fullPath);
      
      // Check if BOM already exists
      if (content.length >= 3 && 
          content[0] === 0xEF && 
          content[1] === 0xBB && 
          content[2] === 0xBF) {
        console.log(`  ✓ ${fullPath} (BOM already exists)`);
        continue;
      }
      
      // Add BOM
      const newContent = Buffer.concat([UTF8_BOM, content]);
      writeFileSync(fullPath, newContent);
      console.log(`  ✓ ${fullPath} (BOM added)`);
    }
  }
}

// Main
const targetDir = process.argv[2];

if (!targetDir) {
  console.error('Usage: node add-utf8-bom.mjs <directory>');
  process.exit(1);
}

console.log(`Adding UTF-8 BOM to Markdown files in: ${targetDir}`);
addBomToMarkdownFiles(targetDir);
console.log('Done!');
