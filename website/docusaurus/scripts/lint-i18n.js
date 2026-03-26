// Documentation standard: docs/specs/SPEC-022-website-publishing-and-i18n-standard.md
//
// Run ONLY after collect-site.js. Requires glob 10.0.0 (uses globSync).

const fs = require('fs-extra')
const path = require('path')
const { globSync } = require('glob') // glob v10 API

const siteDir = path.resolve(__dirname, '..')
const docsDir = path.join(siteDir, 'docs')
const i18nDir = path.join(siteDir, 'i18n')

const EXCLUDE_FROM_LINT = new Set([
  'specs/DOC-COUNTERS.md',
  'specs/STRUCTURE.md',
])

if (!fs.existsSync(docsDir)) {
  console.error('ERROR: website/docusaurus/docs/ does not exist.')
  console.error('Run first: node scripts/collect-site.js')
  process.exit(1)
}

const locales = fs.existsSync(i18nDir)
  ? fs.readdirSync(i18nDir).filter(d => fs.statSync(path.join(i18nDir, d)).isDirectory())
  : []

if (locales.length === 0) {
  console.warn('WARNING: No locale directories found in i18n/.')
  process.exit(0)
}

const enFiles = globSync('**/*.md', { cwd: docsDir })
  .filter(f => !f.endsWith('/index.md') && f !== 'index.md' && !EXCLUDE_FROM_LINT.has(f))

let totalMissing = 0

for (const locale of locales) {
  const localeDir = path.join(i18nDir, locale, 'docusaurus-plugin-content-docs', 'current')
  if (!fs.existsSync(localeDir)) {
    console.warn(`i18n/${locale} current/ does not exist  skipping`)
    continue
  }

  let missing = 0
  for (const f of enFiles) {
    if (!fs.existsSync(path.join(localeDir, f))) {
      console.warn(`i18n/${locale} missing: ${f}`)
      missing++
    }
  }

  if (missing > 0) {
    console.warn(`i18n/${locale} ${missing} file(s) without translation (warning only)`)
    totalMissing += missing
  } else {
    console.log(` i18n/${locale}: all ${enFiles.length} files have translations`)
  }
}

console.log(`\nSummary: ${totalMissing} missing translation(s) across ${locales.length} locale(s)`)
// Uncomment when 100% coverage reached:
// if (totalMissing > 0) process.exit(1)
