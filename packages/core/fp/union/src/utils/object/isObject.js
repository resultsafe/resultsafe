// @resultsafe/core-fp-union/src/utils/object/isObject.ts
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
  exports.isObject = void 0;
  var isObject = function (value) {
    return typeof value === 'object' && value !== null;
  };
  exports.isObject = isObject;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaXNPYmplY3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpc09iamVjdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxvREFBb0Q7Ozs7Ozs7Ozs7Ozs7SUFFN0MsSUFBTSxRQUFRLEdBQUcsVUFBQyxLQUFjO1FBQ3JDLE9BQUEsT0FBTyxLQUFLLEtBQUssUUFBUSxJQUFJLEtBQUssS0FBSyxJQUFJO0lBQTNDLENBQTJDLENBQUM7SUFEakMsUUFBQSxRQUFRLFlBQ3lCIn0=


