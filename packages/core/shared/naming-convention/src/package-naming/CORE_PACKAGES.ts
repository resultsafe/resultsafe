import { PACKAGE_SCOPE } from './PACKAGE_SCOPE.js';

// =============================================================================
export const CORE_PACKAGES = {
  // Functional Programming Context
  FP: {
    OPTION: `${PACKAGE_SCOPE}/monorepo-core-fp-option` as const,
    OPTION_SHARED: `${PACKAGE_SCOPE}/monorepo-core-fp-option-shared` as const,

    RESULT: `${PACKAGE_SCOPE}/monorepo-core-fp-result` as const,
    RESULT_SHARED: `${PACKAGE_SCOPE}/monorepo-core-fp-result-shared` as const,

    UNION: `${PACKAGE_SCOPE}/monorepo-core-fp-union` as const,
    UNION_SHARED: `${PACKAGE_SCOPE}/monorepo-core-fp-union-shared` as const,
  },

  // Data Structures Context
  DS: {
    COLLECTION: `${PACKAGE_SCOPE}/monorepo-core-ds-collection` as const,
    COLLECTION_SHARED: `${PACKAGE_SCOPE}/monorepo-core-ds-collection-shared` as const,

    TREE: `${PACKAGE_SCOPE}/monorepo-core-ds-tree` as const,
    TREE_SHARED: `${PACKAGE_SCOPE}/monorepo-core-ds-tree-shared` as const,
  },

  // Utilities Context
  UTILS: {
    MATCHING: `${PACKAGE_SCOPE}/monorepo-core-utils-matching` as const,
    VALIDATION: `${PACKAGE_SCOPE}/monorepo-core-utils-validation` as const,
    SERIALIZATION: `${PACKAGE_SCOPE}/monorepo-core-utils-serialization` as const,
  },
} as const;
