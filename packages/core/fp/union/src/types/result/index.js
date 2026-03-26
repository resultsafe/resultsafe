// @resultsafe/core-fp-union/src/types/result/index.ts
(function (factory) {
  if (typeof module === 'object' && typeof module.exports === 'object') {
    var v = factory(require, exports);
    if (v !== undefined) module.exports = v;
  } else if (typeof define === 'function' && define.amd) {
    define([
      'require',
      'exports',
      './CreateAnyResult.js',
      './CreateResultShape.js',
      './RefinedErr.js',
      './RefinedFailure.js',
      './RefinedOk.js',
      './RefinedResult.js',
      './RefinedSuccess.js',
      './RefinedVariant.js',
    ], factory);
  }
})(function (require, exports) {
  'use strict';
  Object.defineProperty(exports, '__esModule', { value: true });
  var CreateAnyResult_js_1 = require('./CreateAnyResult.js');
  var CreateResultShape_js_1 = require('./CreateResultShape.js');
  var RefinedErr_js_1 = require('./RefinedErr.js');
  var RefinedFailure_js_1 = require('./RefinedFailure.js');
  var RefinedOk_js_1 = require('./RefinedOk.js');
  var RefinedResult_js_1 = require('./RefinedResult.js');
  var RefinedSuccess_js_1 = require('./RefinedSuccess.js');
  var RefinedVariant_js_1 = require('./RefinedVariant.js');
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxpREFBaUQ7Ozs7Ozs7Ozs7OztJQUVqRCwyREFBNEQ7SUFDNUQsK0RBQWdFO0lBQ2hFLGlEQUFrRDtJQUNsRCx5REFBMEQ7SUFDMUQsK0NBQWdEO0lBQ2hELHVEQUF3RDtJQUN4RCx5REFBMEQ7SUFDMUQseURBQTBEIn0=


