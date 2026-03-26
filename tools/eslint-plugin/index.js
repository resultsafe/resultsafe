/**
 * @resultsafe/eslint-plugin
 * 
 * Custom ESLint rules for the resultsafe monorepo.
 */

import requireSinceVersion from './require-since-version.js';

export const rules = {
  'require-since-version': requireSinceVersion,
};

export const configs = {
  recommended: {
    plugins: ['@resultsafe'],
    rules: {
      '@resultsafe/require-since-version': 'error',
    },
  },
};

export default {
  rules,
  configs,
};
