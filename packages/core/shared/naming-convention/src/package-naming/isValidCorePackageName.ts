import { CORE_CONTEXTS } from './CORE_CONTEXTS.js';
import { PACKAGE_SCOPE } from './PACKAGE_SCOPE.js';
import { PACKAGE_TYPES } from './PACKAGE_TYPES.js';

export const isValidCorePackageName = (name: string): boolean => {
  const escapedScope = PACKAGE_SCOPE.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const pattern = new RegExp(
    `^${escapedScope}/monorepo-core-(${Object.values(CORE_CONTEXTS).join('|')})-([a-z][a-z0-9]*)(-(${Object.values(
      PACKAGE_TYPES,
    )
      .map((t) => t.replace('-', ''))
      .join('|')}))?$`,
  );
  return pattern.test(name);
};
