/**
 * ESLint rule: require-since-version
 * 
 * Requires @since tag on all exported symbols with valid version.
 * Auto-fixes by adding @since with current package version.
 */

import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Get package version from nearest package.json
 */
function getPackageVersion(context) {
  try {
    const filePath = context.filename || context.getFilename();
    let currentDir = dirname(filePath);
    
    while (currentDir !== dirname(currentDir)) {
      try {
        const pkgPath = resolve(currentDir, 'package.json');
        const pkg = JSON.parse(readFileSync(pkgPath, 'utf8'));
        if (pkg.version) {
          return pkg.version;
        }
      } catch {
        // Continue searching
      }
      currentDir = dirname(currentDir);
    }
    
    // Fallback to root package.json
    const rootPkg = JSON.parse(
      readFileSync(resolve(__dirname, '../../../package.json'), 'utf8')
    );
    return rootPkg.version || '0.0.0';
  } catch {
    return '0.0.0';
  }
}

/**
 * Parse semver version
 */
function parseVersion(version) {
  const match = version.match(/^(\d+)\.(\d+)\.(\d+)/);
  if (!match) return null;
  return {
    major: parseInt(match[1], 10),
    minor: parseInt(match[2], 10),
    patch: parseInt(match[3], 10),
  };
}

/**
 * Compare two semver versions
 * Returns: -1 if v1 < v2, 0 if equal, 1 if v1 > v2
 */
function compareVersions(v1, v2) {
  const ver1 = parseVersion(v1);
  const ver2 = parseVersion(v2);
  
  if (!ver1 || !ver2) return 0;
  
  if (ver1.major !== ver2.major) return ver1.major - ver2.major;
  if (ver1.minor !== ver2.minor) return ver1.minor - ver2.minor;
  return ver1.patch - ver2.patch;
}

/**
 * Check if comment is JSDoc with export
 */
function isJSDocWithExport(comment, sourceCode, node) {
  if (!comment.value.includes('*')) return false;
  
  // Check if this comment is attached to an export
  const textAfterComment = sourceCode.text.slice(comment.range[1]);
  const isExport = /^\s*export\s+(type|const|function|class|interface|enum)/.test(textAfterComment);
  
  return isExport;
}

/**
 * Extract @since tag from JSDoc comment
 */
function extractSinceTag(commentValue) {
  const sinceMatch = commentValue.match(/@since\s+([\d.]+|Next)/i);
  return sinceMatch ? sinceMatch[1] : null;
}

/**
 * Find position to insert @since tag
 */
function findInsertionPosition(comment, sourceCode) {
  const lines = comment.value.split('\n');
  
  // Find @public, @internal, or end of comment
  let insertIndex = -1;
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('@public') || lines[i].includes('@internal')) {
      insertIndex = i;
      break;
    }
  }
  
  if (insertIndex === -1) {
    // Insert before closing */
    insertIndex = lines.length - 1;
  }
  
  // Calculate character position
  let position = comment.range[0];
  for (let i = 0; i < insertIndex; i++) {
    position = comment.value.indexOf('\n', position) + 1;
  }
  
  return position;
}

export default {
  meta: {
    type: 'problem',
    docs: {
      description: 'Require @since tag with valid version on all exports',
      recommended: 'error',
    },
    fixable: 'code',
    schema: [
      {
        type: 'object',
        properties: {
          allowNext: {
            type: 'boolean',
            default: true,
          },
          minVersion: {
            type: 'string',
          },
        },
        additionalProperties: false,
      },
    ],
    messages: {
      missing: 'Missing @since tag on exported symbol "{{name}}"',
      invalid: 'Invalid @since version "{{version}}" for "{{name}}"',
      outdated: '@since version "{{version}}" is outdated for "{{name}}" (current: {{current}})',
    },
  },
  create(context) {
    const options = context.options[0] || {};
    const allowNext = options.allowNext ?? true;
    const minVersion = options.minVersion;
    const packageVersion = getPackageVersion(context);
    
    return {
      Program(node) {
        const sourceCode = context.getSourceCode();
        const comments = sourceCode.getAllComments();
        
        comments.forEach(comment => {
          if (comment.type !== 'Block' || !comment.value.includes('*')) {
            return;
          }
          
          // Check if this JSDoc is attached to an export
          const textAfterComment = sourceCode.text.slice(comment.range[1]);
          const exportMatch = textAfterComment.match(/^\s*export\s+(type|const|function|class|interface|enum)\s+(\w+)/);
          
          if (!exportMatch) {
            return;
          }
          
          const exportName = exportMatch[2];
          const sinceTag = extractSinceTag(comment.value);
          
          // Report missing @since
          if (!sinceTag) {
            context.report({
              node,
              messageId: 'missing',
              data: { name: exportName },
              fix(fixer) {
                const insertPos = findInsertionPosition(comment, sourceCode);
                return fixer.insertTextBeforeRange(
                  [insertPos, insertPos],
                  `\n * @since ${packageVersion}`
                );
              },
            });
            return;
          }
          
          // Allow @since Next for unreleased changes
          if (sinceTag === 'Next' && allowNext) {
            return;
          }
          
          // Validate version format
          if (!parseVersion(sinceTag)) {
            context.report({
              node,
              messageId: 'invalid',
              data: { name: exportName, version: sinceTag },
            });
            return;
          }
          
          // Check version is not outdated
          if (minVersion && compareVersions(sinceTag, minVersion) < 0) {
            context.report({
              node,
              messageId: 'outdated',
              data: { name: exportName, version: sinceTag, current: packageVersion },
            });
          }
        });
      },
    };
  },
};
