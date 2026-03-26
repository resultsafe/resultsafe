// @resultsafe/core-fp-union/src/types/validation/index.ts
(function (factory) {
  if (typeof module === 'object' && typeof module.exports === 'object') {
    var v = factory(require, exports);
    if (v !== undefined) module.exports = v;
  } else if (typeof define === 'function' && define.amd) {
    define([
      'require',
      'exports',
      './AsyncValidatorFn.js',
      './PayloadValidator.js',
      './ValidationError.js',
      './ValidationResult.js',
      './Validator.js',
      './ValidatorFn.js',
    ], factory);
  }
})(function (require, exports) {
  'use strict';
  Object.defineProperty(exports, '__esModule', { value: true });
  var AsyncValidatorFn_js_1 = require('./AsyncValidatorFn.js');
  var PayloadValidator_js_1 = require('./PayloadValidator.js');
  var ValidationError_js_1 = require('./ValidationError.js');
  var ValidationResult_js_1 = require('./ValidationResult.js');
  var Validator_js_1 = require('./Validator.js');
  var ValidatorFn_js_1 = require('./ValidatorFn.js');
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxxREFBcUQ7Ozs7Ozs7Ozs7OztJQUVyRCw2REFBOEQ7SUFDOUQsNkRBQThEO0lBQzlELDJEQUE0RDtJQUM1RCw2REFBOEQ7SUFDOUQsK0NBQWdEO0lBQ2hELG1EQUFvRCJ9


