// @resultsafe/core-fp-union/src/utils/object/safeValidate.ts
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
  exports.safeValidate = void 0;
  var safeValidate = function (validator, value) {
    try {
      return validator(value);
    } catch (_a) {
      return false;
    }
  };
  exports.safeValidate = safeValidate;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2FmZVZhbGlkYXRlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsic2FmZVZhbGlkYXRlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLHdEQUF3RDs7Ozs7Ozs7Ozs7OztJQUVqRCxJQUFNLFlBQVksR0FBRyxVQUMxQixTQUF5QyxFQUN6QyxLQUFjO1FBRWQsSUFBSSxDQUFDO1lBQ0gsT0FBTyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDMUIsQ0FBQztRQUFDLFdBQU0sQ0FBQztZQUNQLE9BQU8sS0FBSyxDQUFDO1FBQ2YsQ0FBQztJQUNILENBQUMsQ0FBQztJQVRXLFFBQUEsWUFBWSxnQkFTdkIifQ==


