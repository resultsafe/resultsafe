import { PACKAGE_SCOPE } from './PACKAGE_SCOPE.js';
import type { PackageDescriptor } from './PackageDescriptor.js';

export const generateCorePackageName = (
  descriptor: PackageDescriptor,
): `${string}/${string}-${string}${string}` => {
  const { context, name, type = '', scope = PACKAGE_SCOPE } = descriptor;
  return `${scope}/monorepo-core-${context}-${name}${type}` as const;
};
