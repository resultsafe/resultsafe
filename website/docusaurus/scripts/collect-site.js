// Documentation standard: docs/specs/SPEC-022-website-publishing-and-i18n-standard.md
const fs = require('fs-extra')
const path = require('path')

const sourceDir = path.resolve(__dirname, '../../../docs')
const destDir = path.resolve(__dirname, '../docs')

const EXCLUDE_DIRS = new Set(['archive', '_templates', '_attachments', '_generated'])
const EXCLUDE_ROOT_FILES = new Set(['RULES.md', 'STRUCTURE.md'])

fs.emptyDirSync(destDir)

for (const f of fs.readdirSync(sourceDir)) {
  const abs = path.join(sourceDir, f)
  if (f.endsWith('.md') && fs.statSync(abs).isFile() && !EXCLUDE_ROOT_FILES.has(f)) {
    fs.copySync(abs, path.join(destDir, f))
  }
}

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
