// @resultsafe/core-fp-union/src/validators/index.ts
(function (factory) {
  if (typeof module === 'object' && typeof module.exports === 'object') {
    var v = factory(require, exports);
    if (v !== undefined) module.exports = v;
  } else if (typeof define === 'function' && define.amd) {
    define([
      'require',
      'exports',
      './createError.js',
      './createResultValidator.js',
      './createSuccess.js',
    ], factory);
  }
})(function (require, exports) {
  'use strict';
  Object.defineProperty(exports, '__esModule', { value: true });
  exports.createSuccess =
    exports.createResultValidator =
    exports.createError =
      void 0;
  var createError_js_1 = require('./createError.js');
  Object.defineProperty(exports, 'createError', {
    enumerable: true,
    get: function () {
      return createError_js_1.createError;
    },
  });
  var createResultValidator_js_1 = require('./createResultValidator.js');
  Object.defineProperty(exports, 'createResultValidator', {
    enumerable: true,
    get: function () {
      return createResultValidator_js_1.createResultValidator;
    },
  });
  var createSuccess_js_1 = require('./createSuccess.js');
  Object.defineProperty(exports, 'createSuccess', {
    enumerable: true,
    get: function () {
      return createSuccess_js_1.createSuccess;
    },
  });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSwrQ0FBK0M7Ozs7Ozs7Ozs7Ozs7SUFFL0MsbURBQStDO0lBQXRDLDZHQUFBLFdBQVcsT0FBQTtJQUNwQix1RUFBbUU7SUFBMUQsaUlBQUEscUJBQXFCLE9BQUE7SUFDOUIsdURBQW1EO0lBQTFDLGlIQUFBLGFBQWEsT0FBQSJ9


