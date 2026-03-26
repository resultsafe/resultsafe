// @resultsafe/core-fp-union/src/utils/isVariantConfig.ts
(function (factory) {
  if (typeof module === 'object' && typeof module.exports === 'object') {
    var v = factory(require, exports);
    if (v !== undefined) module.exports = v;
  } else if (typeof define === 'function' && define.amd) {
    define(['require', 'exports'], factory);
  }
})(function (require, exports) {
  'use strict';
  Object.defineProperty(exports, '__esModule', { value: true });
  exports.isVariantConfig = void 0;
  var isVariantConfig = function (value) {
    if (typeof value !== 'object' || value === null) return false;
    var config = value;
    if (!('payload' in config)) return false;
    var payload = config['payload'];
    if (
      payload !== 'never' &&
      typeof payload !== 'string' &&
      !Array.isArray(payload)
    ) {
      return false;
    }
    if (
      'forbidden' in config &&
      typeof config['forbidden'] !== 'string' &&
      config['forbidden'] !== undefined
    ) {
      return false;
    }
    if (
      'strictFields' in config &&
      typeof config['strictFields'] !== 'boolean' &&
      config['strictFields'] !== undefined
    ) {
      return false;
    }
    return true;
  };
  exports.isVariantConfig = isVariantConfig;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaXNWYXJpYW50Q29uZmlnLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiaXNWYXJpYW50Q29uZmlnLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLG9EQUFvRDs7Ozs7Ozs7Ozs7OztJQUk3QyxJQUFNLGVBQWUsR0FBRyxVQUFDLEtBQWM7UUFDNUMsSUFBSSxPQUFPLEtBQUssS0FBSyxRQUFRLElBQUksS0FBSyxLQUFLLElBQUk7WUFBRSxPQUFPLEtBQUssQ0FBQztRQUU5RCxJQUFNLE1BQU0sR0FBRyxLQUFnQyxDQUFDO1FBRWhELElBQUksQ0FBQyxDQUFDLFNBQVMsSUFBSSxNQUFNLENBQUM7WUFBRSxPQUFPLEtBQUssQ0FBQztRQUN6QyxJQUFNLE9BQU8sR0FBRyxNQUFNLENBQUMsU0FBUyxDQUFDLENBQUM7UUFFbEMsSUFDRSxPQUFPLEtBQUssT0FBTztZQUNuQixPQUFPLE9BQU8sS0FBSyxRQUFRO1lBQzNCLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsRUFDdkIsQ0FBQztZQUNELE9BQU8sS0FBSyxDQUFDO1FBQ2YsQ0FBQztRQUVELElBQ0UsV0FBVyxJQUFJLE1BQU07WUFDckIsT0FBTyxNQUFNLENBQUMsV0FBVyxDQUFDLEtBQUssUUFBUTtZQUN2QyxNQUFNLENBQUMsV0FBVyxDQUFDLEtBQUssU0FBUyxFQUNqQyxDQUFDO1lBQ0QsT0FBTyxLQUFLLENBQUM7UUFDZixDQUFDO1FBRUQsSUFDRSxjQUFjLElBQUksTUFBTTtZQUN4QixPQUFPLE1BQU0sQ0FBQyxjQUFjLENBQUMsS0FBSyxTQUFTO1lBQzNDLE1BQU0sQ0FBQyxjQUFjLENBQUMsS0FBSyxTQUFTLEVBQ3BDLENBQUM7WUFDRCxPQUFPLEtBQUssQ0FBQztRQUNmLENBQUM7UUFFRCxPQUFPLElBQUksQ0FBQztJQUNkLENBQUMsQ0FBQztJQWpDVyxRQUFBLGVBQWUsbUJBaUMxQiJ9


