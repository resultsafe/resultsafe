// @resultsafe/core-fp-union/src/types/index.ts
var __createBinding =
  (this && this.__createBinding) ||
  (Object.create
    ? function (o, m, k, k2) {
        if (k2 === undefined) k2 = k;
        var desc = Object.getOwnPropertyDescriptor(m, k);
        if (
          !desc ||
          ('get' in desc ? !m.__esModule : desc.writable || desc.configurable)
        ) {
          desc = {
            enumerable: true,
            get: function () {
              return m[k];
            },
          };
        }
        Object.defineProperty(o, k2, desc);
      }
    : function (o, m, k, k2) {
        if (k2 === undefined) k2 = k;
        o[k2] = m[k];
      });
var __exportStar =
  (this && this.__exportStar) ||
  function (m, exports) {
    for (var p in m)
      if (p !== 'default' && !Object.prototype.hasOwnProperty.call(exports, p))
        __createBinding(exports, m, p);
  };
(function (factory) {
  if (typeof module === 'object' && typeof module.exports === 'object') {
    var v = factory(require, exports);
    if (v !== undefined) module.exports = v;
  } else if (typeof define === 'function' && define.amd) {
    define([
      'require',
      'exports',
      './result/index.js',
      './utils/index.js',
      './validation/index.js',
      './variant/index.js',
    ], factory);
  }
})(function (require, exports) {
  'use strict';
  Object.defineProperty(exports, '__esModule', { value: true });
  __exportStar(require('./result/index.js'), exports);
  __exportStar(require('./utils/index.js'), exports);
  __exportStar(require('./validation/index.js'), exports);
  __exportStar(require('./variant/index.js'), exports);
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSwwQ0FBMEM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0lBRTFDLG9EQUFrQztJQUNsQyxtREFBaUM7SUFDakMsd0RBQXNDO0lBQ3RDLHFEQUFtQyJ9


