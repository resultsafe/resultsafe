// @resultsafe/core-fp-union/src/types/variant/index.ts
(function (factory) {
  if (typeof module === 'object' && typeof module.exports === 'object') {
    var v = factory(require, exports);
    if (v !== undefined) module.exports = v;
  } else if (typeof define === 'function' && define.amd) {
    define([
      'require',
      'exports',
      './DiscriminatedUnion.js',
      './VariantConfig.js',
      './VariantShape.js',
    ], factory);
  }
})(function (require, exports) {
  'use strict';
  Object.defineProperty(exports, '__esModule', { value: true });
  exports.DEFAULT_VARIANT_CONFIG = void 0;
  var DiscriminatedUnion_js_1 = require('./DiscriminatedUnion.js');
  var VariantConfig_js_1 = require('./VariantConfig.js');
  Object.defineProperty(exports, 'DEFAULT_VARIANT_CONFIG', {
    enumerable: true,
    get: function () {
      return VariantConfig_js_1.DEFAULT_VARIANT_CONFIG;
    },
  });
  var VariantShape_js_1 = require('./VariantShape.js');
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxrREFBa0Q7Ozs7Ozs7Ozs7Ozs7SUFFbEQsaUVBQWtFO0lBQ2xFLHVEQUFnRjtJQUF2RSwwSEFBQSxzQkFBc0IsT0FBQTtJQUMvQixxREFBc0QifQ==


