// @resultsafe/core-fp-union/src/utils/refinement/refineDiscriminatedUnion.ts
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
  exports.refineDiscriminatedUnion = void 0;
  var refineDiscriminatedUnion = function (value, predicate) {
    return predicate(value) ? value : null;
  };
  exports.refineDiscriminatedUnion = refineDiscriminatedUnion;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVmaW5lRGlzY3JpbWluYXRlZFVuaW9uLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsicmVmaW5lRGlzY3JpbWluYXRlZFVuaW9uLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLHdFQUF3RTs7Ozs7Ozs7Ozs7OztJQUlqRSxJQUFNLHdCQUF3QixHQUFHLFVBSXRDLEtBQVEsRUFDUixTQUFtQztRQUVuQyxPQUFPLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUM7SUFDekMsQ0FBQyxDQUFDO0lBUlcsUUFBQSx3QkFBd0IsNEJBUW5DIn0=


