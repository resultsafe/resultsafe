import { TypeDescriptor } from './TypeDescriptor.js';

export const generateTypeName = (descriptor: TypeDescriptor): string => {
  const { category, name, context, isAbstract = false, pattern } = descriptor;

  let result = name;

  // Add prefixes based on category
  switch (category) {
    case 'interface':
      result = `${TYPE_CONVENTIONS.INTERFACE_PREFIX}${result}`;
      break;
    case 'type':
      result = `${TYPE_CONVENTIONS.TYPE_PREFIX}${result}`;
      break;
  }

  // Add abstract prefix
  if (isAbstract) {
    result = `${TYPE_CONVENTIONS.ABSTRACT_PREFIX}${result}`;
  }

  // Add suffixes based on pattern
  switch (pattern) {
    case 'builder':
      result = `${result}${TYPE_CONVENTIONS.BUILDER_SUFFIX}`;
      break;
    case 'factory':
      result = `${result}${TYPE_CONVENTIONS.FACTORY_SUFFIX}`;
      break;
    case 'error':
      result = `${result}${TYPE_CONVENTIONS.ERROR_SUFFIX}`;
      break;
    case 'exception':
      result = `${result}${TYPE_CONVENTIONS.EXCEPTION_SUFFIX}`;
      break;
  }

  // Add context prefix if provided
  if (context) {
    result = `${context}${result}`;
  }

  return result;
};
