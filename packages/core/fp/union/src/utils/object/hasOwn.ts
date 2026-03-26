// @resultsafe/core-fp-union/src/utils/object/hasOwn.ts

export const hasOwn = <K extends PropertyKey>(
  obj: Record<string, unknown>,
  key: K,
): obj is Record<K, unknown> => Object.prototype.hasOwnProperty.call(obj, key);


