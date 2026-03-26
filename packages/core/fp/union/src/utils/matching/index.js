// @resultsafe/core-fp-union/src/utils/matching/index.ts
(function (factory) {
  if (typeof module === 'object' && typeof module.exports === 'object') {
    var v = factory(require, exports);
    if (v !== undefined) module.exports = v;
  } else if (typeof define === 'function' && define.amd) {
    define([
      'require',
      'exports',
      './matchDiscriminatedUnion.js',
      './matchDiscriminatedUnionStrict.js',
    ], factory);
  }
})(function (require, exports) {
  'use strict';
  Object.defineProperty(exports, '__esModule', { value: true });
  exports.matchDiscriminatedUnionStrict = exports.matchDiscriminatedUnion =
    void 0;
  var matchDiscriminatedUnion_js_1 = require('./matchDiscriminatedUnion.js');
  Object.defineProperty(exports, 'matchDiscriminatedUnion', {
    enumerable: true,
    get: function () {
      return matchDiscriminatedUnion_js_1.matchDiscriminatedUnion;
    },
  });
  var matchDiscriminatedUnionStrict_js_1 = require('./matchDiscriminatedUnionStrict.js');
  Object.defineProperty(exports, 'matchDiscriminatedUnionStrict', {
    enumerable: true,
    get: function () {
      return matchDiscriminatedUnionStrict_js_1.matchDiscriminatedUnionStrict;
    },
  });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxtREFBbUQ7Ozs7Ozs7Ozs7Ozs7SUFFbkQsMkVBQXVFO0lBQTlELHFJQUFBLHVCQUF1QixPQUFBO0lBQ2hDLHVGQUFtRjtJQUExRSxpSkFBQSw2QkFBNkIsT0FBQSJ9


