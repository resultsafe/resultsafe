// Documentation standard: docs/RULES.md
const fs   = require('fs-extra')
const path = require('path')

const sourceDir = path.resolve(__dirname, '../../../docs')
const destDir   = path.resolve(__dirname, '../docs')

// Internal folders  never published to the site
const EXCLUDE_DIRS = new Set(['archive', '_templates', '_attachments', '_generated'])

// Internal root-level files  governance docs, not site content
// Only index.md from docs/ root is published
const EXCLUDE_ROOT_FILES = new Set(['RULES.md', 'STRUCTURE.md'])

// emptyDirSync creates destDir if it does not exist, then clears it
fs.emptyDirSync(destDir)

// Copy allowed root-level md files (only index.md in practice)
for (const f of fs.readdirSync(sourceDir)) {
  const abs = path.join(sourceDir, f)
  if (f.endsWith('.md') && fs.statSync(abs).isFile() && !EXCLUDE_ROOT_FILES.has(f)) {
    fs.copySync(abs, path.join(destDir, f))
  }
}

// Copy published sections (all directories except excluded ones)
const sections = fs.readdirSync(sourceDir).filter(dir => {
  if (EXCLUDE_DIRS.has(dir)) return false
  if (dir.startsWith('.')) return false
  return fs.statSync(path.join(sourceDir, dir)).isDirectory()
})

for (const section of sections) {
  fs.copySync(path.join(sourceDir, section), path.join(destDir, section))
  console.log(`  ${section}`)
}

console.log('Done.')
