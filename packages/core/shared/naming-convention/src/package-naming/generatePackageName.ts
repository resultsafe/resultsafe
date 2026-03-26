// Может использовать типы из kernel/

import type { PackageNamingOptions } from './PackageNamingOptions.js';

export const generatePackageName = (
  options: PackageNamingOptions,
): `${string}/${string}-${string}${string}` => {
  const { context, name, type = '', scope = '@resultsafe' } = options;
  return `${scope}/monorepo-${context}-${name}${type}` as const;
};
