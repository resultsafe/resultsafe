// @resultsafe/core-fp-union/src/utils/createVariantConfig.ts
var __assign =
  (this && this.__assign) ||
  function () {
    __assign =
      Object.assign ||
      function (t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
          s = arguments[i];
          for (var p in s)
            if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
      };
    return __assign.apply(this, arguments);
  };
(function (factory) {
  if (typeof module === 'object' && typeof module.exports === 'object') {
    var v = factory(require, exports);
    if (v !== undefined) module.exports = v;
  } else if (typeof define === 'function' && define.amd) {
    define([
      'require',
      'exports',
      '../../types/variant/VariantConfig.js',
    ], factory);
  }
})(function (require, exports) {
  'use strict';
  Object.defineProperty(exports, '__esModule', { value: true });
  exports.createVariantConfig = void 0;
  var VariantConfig_js_1 = require('../../types/variant/VariantConfig.js');
  var createVariantConfig = function (config) {
    return __assign(
      __assign({}, VariantConfig_js_1.DEFAULT_VARIANT_CONFIG),
      config,
    );
  };
  exports.createVariantConfig = createVariantConfig;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3JlYXRlVmFyaWFudENvbmZpZy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImNyZWF0ZVZhcmlhbnRDb25maWcudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsd0RBQXdEOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7SUFFeEQseUVBRzhDO0lBRXZDLElBQU0sbUJBQW1CLEdBQUcsVUFDakMsTUFBUztRQUVULE9BQU8sc0JBQ0YseUNBQXNCLEdBQ3RCLE1BQU0sQ0FDVyxDQUFDO0lBQ3pCLENBQUMsQ0FBQztJQVBXLFFBQUEsbUJBQW1CLHVCQU85QiJ9


