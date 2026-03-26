// @resultsafe/core-fp-union/src/guards/index.ts
(function (factory) {
  if (typeof module === 'object' && typeof module.exports === 'object') {
    var v = factory(require, exports);
    if (v !== undefined) module.exports = v;
  } else if (typeof define === 'function' && define.amd) {
    define([
      'require',
      'exports',
      './isErrAnd.js',
      './isErrOfType.js',
      './isFailure.js',
      './isOk.js',
      './isOkAnd.js',
      './isOkOfType.js',
      './isResult.js',
      './isSuccess.js',
      './isValidatedResult.js',
      './isVariant.js',
      './isVariantAnd.js',
      './isVariantOfType.js',
    ], factory);
  }
})(function (require, exports) {
  'use strict';
  Object.defineProperty(exports, '__esModule', { value: true });
  exports.isVariantOfType =
    exports.isVariantAnd =
    exports.isVariant =
    exports.isValidatedResult =
    exports.isSuccess =
    exports.isResult =
    exports.isOkOfType =
    exports.isOkAnd =
    exports.isOk =
    exports.isFailure =
    exports.isErrOfType =
    exports.isErrAnd =
      void 0;
  var isErrAnd_js_1 = require('./isErrAnd.js');
  Object.defineProperty(exports, 'isErrAnd', {
    enumerable: true,
    get: function () {
      return isErrAnd_js_1.isErrAnd;
    },
  });
  var isErrOfType_js_1 = require('./isErrOfType.js');
  Object.defineProperty(exports, 'isErrOfType', {
    enumerable: true,
    get: function () {
      return isErrOfType_js_1.isErrOfType;
    },
  });
  var isFailure_js_1 = require('./isFailure.js');
  Object.defineProperty(exports, 'isFailure', {
    enumerable: true,
    get: function () {
      return isFailure_js_1.isFailure;
    },
  });
  var isOk_js_1 = require('./isOk.js');
  Object.defineProperty(exports, 'isOk', {
    enumerable: true,
    get: function () {
      return isOk_js_1.isOk;
    },
  });
  var isOkAnd_js_1 = require('./isOkAnd.js');
  Object.defineProperty(exports, 'isOkAnd', {
    enumerable: true,
    get: function () {
      return isOkAnd_js_1.isOkAnd;
    },
  });
  var isOkOfType_js_1 = require('./isOkOfType.js');
  Object.defineProperty(exports, 'isOkOfType', {
    enumerable: true,
    get: function () {
      return isOkOfType_js_1.isOkOfType;
    },
  });
  var isResult_js_1 = require('./isResult.js');
  Object.defineProperty(exports, 'isResult', {
    enumerable: true,
    get: function () {
      return isResult_js_1.isResult;
    },
  });
  var isSuccess_js_1 = require('./isSuccess.js');
  Object.defineProperty(exports, 'isSuccess', {
    enumerable: true,
    get: function () {
      return isSuccess_js_1.isSuccess;
    },
  });
  var isValidatedResult_js_1 = require('./isValidatedResult.js');
  Object.defineProperty(exports, 'isValidatedResult', {
    enumerable: true,
    get: function () {
      return isValidatedResult_js_1.isValidatedResult;
    },
  });
  var isVariant_js_1 = require('./isVariant.js');
  Object.defineProperty(exports, 'isVariant', {
    enumerable: true,
    get: function () {
      return isVariant_js_1.isVariant;
    },
  });
  var isVariantAnd_js_1 = require('./isVariantAnd.js');
  Object.defineProperty(exports, 'isVariantAnd', {
    enumerable: true,
    get: function () {
      return isVariantAnd_js_1.isVariantAnd;
    },
  });
  var isVariantOfType_js_1 = require('./isVariantOfType.js');
  Object.defineProperty(exports, 'isVariantOfType', {
    enumerable: true,
    get: function () {
      return isVariantOfType_js_1.isVariantOfType;
    },
  });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSwyQ0FBMkM7Ozs7Ozs7Ozs7Ozs7SUFFM0MsNkNBQXlDO0lBQWhDLHVHQUFBLFFBQVEsT0FBQTtJQUNqQixtREFBK0M7SUFBdEMsNkdBQUEsV0FBVyxPQUFBO0lBQ3BCLCtDQUEyQztJQUFsQyx5R0FBQSxTQUFTLE9BQUE7SUFDbEIscUNBQWlDO0lBQXhCLCtGQUFBLElBQUksT0FBQTtJQUNiLDJDQUF1QztJQUE5QixxR0FBQSxPQUFPLE9BQUE7SUFDaEIsaURBQTZDO0lBQXBDLDJHQUFBLFVBQVUsT0FBQTtJQUNuQiw2Q0FBeUM7SUFBaEMsdUdBQUEsUUFBUSxPQUFBO0lBQ2pCLCtDQUEyQztJQUFsQyx5R0FBQSxTQUFTLE9BQUE7SUFDbEIsK0RBQTJEO0lBQWxELHlIQUFBLGlCQUFpQixPQUFBO0lBQzFCLCtDQUEyQztJQUFsQyx5R0FBQSxTQUFTLE9BQUE7SUFDbEIscURBQWlEO0lBQXhDLCtHQUFBLFlBQVksT0FBQTtJQUNyQiwyREFBdUQ7SUFBOUMscUhBQUEsZUFBZSxPQUFBIn0=


