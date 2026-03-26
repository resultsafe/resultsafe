// @resultsafe/core-fp-union/src/utils/variant/index.ts
(function (factory) {
  if (typeof module === 'object' && typeof module.exports === 'object') {
    var v = factory(require, exports);
    if (v !== undefined) module.exports = v;
  } else if (typeof define === 'function' && define.amd) {
    define([
      'require',
      'exports',
      './createVariantConfig.js',
      './isVariantConfig.js',
    ], factory);
  }
})(function (require, exports) {
  'use strict';
  Object.defineProperty(exports, '__esModule', { value: true });
  exports.isVariantConfig = exports.createVariantConfig = void 0;
  var createVariantConfig_js_1 = require('./createVariantConfig.js');
  Object.defineProperty(exports, 'createVariantConfig', {
    enumerable: true,
    get: function () {
      return createVariantConfig_js_1.createVariantConfig;
    },
  });
  var isVariantConfig_js_1 = require('./isVariantConfig.js');
  Object.defineProperty(exports, 'isVariantConfig', {
    enumerable: true,
    get: function () {
      return isVariantConfig_js_1.isVariantConfig;
    },
  });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxrREFBa0Q7Ozs7Ozs7Ozs7Ozs7SUFFbEQsbUVBQStEO0lBQXRELDZIQUFBLG1CQUFtQixPQUFBO0lBQzVCLDJEQUF1RDtJQUE5QyxxSEFBQSxlQUFlLE9BQUEifQ==


