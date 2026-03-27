# Examples CI/CD Integration Guide

## 📍 Where Scripts Run

### 1. **Local Development**

```bash
# Before commit
pnpm run validate:ai-json
pnpm run lint:examples

# Before build (automatic)
pnpm run build:all
# Runs: validate:ai-json → lint:examples → build

# Before publish (automatic)
pnpm run prepublishOnly
# Runs: verify:release → validate:ai-json → lint:examples
```

### 2. **GitHub Push/PR**

**Workflow:** `.github/workflows/examples.yml`

**Triggers:**

- Push to `__examples__/`
- Pull request with example changes

**Jobs:**

1. `validate-examples` — Validates AI JSDoc JSON
2. `test-examples` — Runs example tests

**Status:** Required check for merge

### 3. **npm Publish**

**Hook:** `prepublishOnly` in `package.json`

**Runs:**

```json
"prepublishOnly": "pnpm run verify:release && pnpm run validate:ai-json && pnpm run lint:examples"
```

**Blocks publish if:**

- AI JSDoc JSON is invalid
- ESLint errors in examples
- Release verification fails

---

## 📁 File Locations

| File                | Location                            | Purpose                   |
| ------------------- | ----------------------------------- | ------------------------- |
| **Standard**        | `__examples__/AI_JSDOC_STANDARD.md` | AI JSDoc specification    |
| **Validator**       | `__scripts__/validate-ai-json.js`   | AI JSON validation script |
| **ESLint Config**   | `config/eslint.config.examples.mjs` | ESLint for examples       |
| **GitHub Workflow** | `.github/workflows/examples.yml`    | CI/CD pipeline            |
| **Package Scripts** | `package.json`                      | npm scripts               |

---

## 🔧 Configuration

### package.json Scripts

```json
{
  "scripts": {
    "validate:ai-json": "node ./__scripts__/validate-ai-json.js",
    "lint:examples": "eslint __examples__/**/*.ts --config config/eslint.config.examples.mjs",
    "lint": "eslint . --ext .ts,.tsx --config config/eslint.config.mjs",
    "lint:fix": "eslint . --ext .ts,.tsx --config config/eslint.config.mjs --fix",
    "prebuild:types": "pnpm run validate:ai-json",
    "prebuild:all": "pnpm run validate:ai-json && pnpm run lint:examples",
    "prepublishOnly": "pnpm run verify:release && pnpm run validate:ai-json && pnpm run lint:examples && pnpm run lint"
  }
}
```

### ESLint Config (examples)

```javascript
// config/eslint.config.examples.mjs
import tsParser from '@typescript-eslint/parser';
import jsdocPlugin from 'eslint-plugin-jsdoc';

export default defineConfig([
  {
    files: ['**/__examples__/**/*.ts'],
    languageOptions: {
      parser: tsParser,
      parserOptions: { project: './tsconfig.json' },
    },
    plugins: { jsdoc: jsdocPlugin },
    rules: {
      'jsdoc/require-description': 'warn',
      'jsdoc/require-example': 'warn',
      'no-console': 'off',
    },
  },
]);
```

### ESLint Config (main package)

```javascript
// config/eslint.config.mjs
import resultsafePlugin from '@resultsafe/eslint-plugin';

export default [
  {
    plugins: {
      '@resultsafe': resultsafePlugin,
    },
    rules: {
      '@resultsafe/require-since-version': 'error', // Auto-generates @since
    },
  },
];
```

### Migration Script (@since tags)

```bash
# Dry run - preview changes
node ../../scripts/migrate-since-tags.mjs --dry-run

# Apply changes
node ../../scripts/migrate-since-tags.mjs
```

---

## ✅ What Gets Validated

### AI JSDoc JSON Structure

```javascript
@ai {
  "purpose": "...",           // ✅ Required
  "prerequisites": [...],     // ✅ Required
  "objectives": [...],        // ✅ Required
  "rag": {                    // ✅ Required
    "queries": [...],
    "intents": [...],
    "expectedAnswer": "..."
  },
  "embedding": {              // ✅ Required
    "semanticKeywords": [...],
    "conceptualTags": [...],
    "useCases": [...]
  },
  "codeSearch": {             // ✅ Required
    "patterns": [...],
    "imports": [...]
  },
  "learningPath": {           // ✅ Required
    "progression": [...]
  },
  "chunkHint": "..."          // ✅ Required
}
```

### ESLint Rules

- JSDoc description present (warn)
- JSDoc example present (warn)
- TypeScript syntax valid
- No console errors (off for examples)

---

## 🚨 Failure Scenarios

| Scenario         | Where Blocked                       | Fix                |
| ---------------- | ----------------------------------- | ------------------ |
| Invalid @ai JSON | Local build, GitHub CI, npm publish | Fix JSON structure |
| ESLint errors    | Local build, GitHub CI, npm publish | Fix code style     |
| Missing @module  | Validation script                   | Add @module tag    |
| Missing @ai      | Validation script                   | Add @ai JSON       |

---

## 📊 Metrics

### Validation Output

```
🔍 Validating AI JSDoc JSON in examples...

✅ __examples__/01-api-reference/01-constructors/01-ok/001-basic-usage/example.ts: Valid @ai JSON
✅ __examples__/01-api-reference/01-constructors/01-ok/002-with-generics/example.ts: Valid @ai JSON

==================================================
✅ Valid: 7
❌ Invalid: 0
⏭️  Skipped (no @module): 125
==================================================

✅ All examples have valid @ai JSON!
```

### CI/CD Status

- ✅ **GitHub Actions** — Green checkmark on PR
- ✅ **npm publish** — Package published
- ❌ **Failed** — Build/publish blocked

---

## 🛠️ Troubleshooting

### "Missing @ai tag"

**Fix:** Add @ai JSON to example:

```ts
/**
 * @module 001-basic-usage
 * @ai {"purpose":"...","prerequisites":[...],...}
 */
```

### "Invalid @ai JSON"

**Fix:** Validate JSON syntax:

```bash
node -e "JSON.parse('{\"purpose\":\"...\"}')"
```

### "ESLint parsing error"

**Fix:** Ensure TypeScript syntax is valid:

```bash
pnpm exec tsc --noEmit __examples__/**/*.ts
```

---

**Last Updated:** 2026-03-27  
**Version:** 2.0.0
