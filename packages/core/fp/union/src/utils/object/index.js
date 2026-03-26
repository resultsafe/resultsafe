// @resultsafe/core-fp-union/src/utils/object/index.ts
(function (factory) {
  if (typeof module === 'object' && typeof module.exports === 'object') {
    var v = factory(require, exports);
    if (v !== undefined) module.exports = v;
  } else if (typeof define === 'function' && define.amd) {
    define([
      'require',
      'exports',
      './hasOwn.js',
      './isObject.js',
      './safeValidate.js',
    ], factory);
  }
})(function (require, exports) {
  'use strict';
  Object.defineProperty(exports, '__esModule', { value: true });
  exports.safeValidate = exports.isObject = exports.hasOwn = void 0;
  var hasOwn_js_1 = require('./hasOwn.js');
  Object.defineProperty(exports, 'hasOwn', {
    enumerable: true,
    get: function () {
      return hasOwn_js_1.hasOwn;
    },
  });
  var isObject_js_1 = require('./isObject.js');
  Object.defineProperty(exports, 'isObject', {
    enumerable: true,
    get: function () {
      return isObject_js_1.isObject;
    },
  });
  var safeValidate_js_1 = require('./safeValidate.js');
  Object.defineProperty(exports, 'safeValidate', {
    enumerable: true,
    get: function () {
      return safeValidate_js_1.safeValidate;
    },
  });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxpREFBaUQ7Ozs7Ozs7Ozs7Ozs7SUFFakQseUNBQXFDO0lBQTVCLG1HQUFBLE1BQU0sT0FBQTtJQUNmLDZDQUF5QztJQUFoQyx1R0FBQSxRQUFRLE9BQUE7SUFDakIscURBQWlEO0lBQXhDLCtHQUFBLFlBQVksT0FBQSJ9


