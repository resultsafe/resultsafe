// Documentation standard: docs/RULES.md
//
// IMPORTANT: Run ONLY after collect-site.js has run.
// Reads site/docusaurus/docs/ which is created by collect-site.js.
// Running before collect will produce false warnings for every file.
//
// Requires glob ^10.0.0  uses globSync (v10 API).
// glob v7/v8 use glob.sync which does not exist in v10.
// glob v9 has no sync API at all.

const fs   = require('fs-extra')
const path = require('path')
const { globSync } = require('glob')   // glob v10 API  do not change to glob.sync

const siteDir = path.resolve(__dirname, '..')
const docsDir = path.join(siteDir, 'docs')        // artifact of collect-site.js
const i18nDir = path.join(siteDir, 'i18n')

// Files intentionally not translated (internal counters, structure refs)
// Paths use forward slashes as returned by globSync on all platforms
const EXCLUDE_FROM_LINT = new Set([
  'specs/DOC-COUNTERS.md',
  'specs/STRUCTURE.md',
])

if (!fs.existsSync(docsDir)) {
  console.error('ERROR: site/docusaurus/docs/ does not exist.')
  console.error('Run collect-site.js first: node scripts/collect-site.js')
  process.exit(1)
}

// Detect all locale directories in i18n/  skip stray files at i18n/ root level
const locales = fs.existsSync(i18nDir)
  ? fs.readdirSync(i18nDir).filter(d =>
      fs.statSync(path.join(i18nDir, d)).isDirectory()
    )
  : []

if (locales.length === 0) {
  console.warn('WARNING: No locale directories found in i18n/. Nothing to check.')
  process.exit(0)
}

// All non-index publishable md files from the English artifact
// globSync always returns forward-slash paths regardless of OS
const enFiles = globSync('**/*.md', { cwd: docsDir })
  .filter(f =>
    !f.endsWith('/index.md') &&
    f !== 'index.md' &&
    !EXCLUDE_FROM_LINT.has(f)
  )

let totalMissing = 0

for (const locale of locales) {
  const localeDir = path.join(
    i18nDir, locale,
    'docusaurus-plugin-content-docs', 'current'
  )
  if (!fs.existsSync(localeDir)) {
    console.warn(`[i18n/${locale}] WARNING: current/ directory does not exist  skipping`)
    continue
  }

  let missing = 0
  for (const f of enFiles) {
    // path.join normalises forward-slash f to OS separator; fs.existsSync handles both
    if (!fs.existsSync(path.join(localeDir, f))) {
      console.warn(`[i18n/${locale}] missing: ${f}`)
      missing++
    }
  }

  if (missing > 0) {
    console.warn(`[i18n/${locale}] ${missing} file(s) without translation (warning only  not a build error)`)
    totalMissing += missing
  } else {
    console.log(` i18n/${locale}: all ${enFiles.length} files have translations`)
  }
}

console.log(`\nSummary: ${totalMissing} missing translation(s) across ${locales.length} locale(s)`)
console.log('These are warnings only. Uncomment process.exit(1) below to make them hard errors.')

// Uncomment when all locales reach 100% translation coverage:
// if (totalMissing > 0) process.exit(1)
