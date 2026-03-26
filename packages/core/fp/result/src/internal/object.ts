/** Checks that an object owns a property key. @internal */
export const hasOwn = <K extends PropertyKey>(
  obj: Record<string, unknown>,
  key: K,
): obj is Record<K, unknown> => Object.prototype.hasOwnProperty.call(obj, key);

/** Checks that a value is a non-null object record. @internal */
export const isObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;
