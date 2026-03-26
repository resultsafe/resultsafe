import { TYPE_CONVENTIONS } from './TYPE_CONVENTIONS.js';

export const isValidTypeName = (
  name: string,
  expectedPattern?: string,
): boolean => {
  // Basic validation rules
  if (!/^[A-Z][a-zA-Z0-9]*$/.test(name)) {
    return false;
  }

  // Pattern-specific validation
  if (expectedPattern) {
    const suffix =
      TYPE_CONVENTIONS[
        `${expectedPattern.toUpperCase()}_SUFFIX` as keyof typeof TYPE_CONVENTIONS
      ];
    if (suffix && !name.endsWith(suffix)) {
      return false;
    }
  }

  return true;
};
