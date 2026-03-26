import { PACKAGE_SCOPE } from './PACKAGE_SCOPE.js';
import type { PackageDescriptor } from './PackageDescriptor.js';

export const parseCorePackageName = (
  name: string,
): PackageDescriptor | null => {
  const match = name.match(
    new RegExp(`^(${PACKAGE_SCOPE})/monorepo-core-([^-]+)-(.+?)(?:-(.+))?$`),
  );

  if (!match) return null;

  const [, scope, context, packageName, type = ''] = match;

  return {
    context,
    name: packageName,
    type: type ? `-${type}` : '',
    scope,
  };
};
