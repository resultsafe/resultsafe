// @resultsafe/core-fp-union/src/utils/object/hasOwn.ts
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
  exports.hasOwn = void 0;
  var hasOwn = function (obj, key) {
    return Object.prototype.hasOwnProperty.call(obj, key);
  };
  exports.hasOwn = hasOwn;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaGFzT3duLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiaGFzT3duLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLGtEQUFrRDs7Ozs7Ozs7Ozs7OztJQUUzQyxJQUFNLE1BQU0sR0FBRyxVQUNwQixHQUE0QixFQUM1QixHQUFNLElBQ3dCLE9BQUEsTUFBTSxDQUFDLFNBQVMsQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUMsRUFBOUMsQ0FBOEMsQ0FBQztJQUhsRSxRQUFBLE1BQU0sVUFHNEQifQ==


