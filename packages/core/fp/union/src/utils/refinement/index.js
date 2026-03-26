// @resultsafe/core-fp-union/src/utils/refinement/index.ts
(function (factory) {
  if (typeof module === 'object' && typeof module.exports === 'object') {
    var v = factory(require, exports);
    if (v !== undefined) module.exports = v;
  } else if (typeof define === 'function' && define.amd) {
    define(['require', 'exports', './refineDiscriminatedUnion.js'], factory);
  }
})(function (require, exports) {
  'use strict';
  Object.defineProperty(exports, '__esModule', { value: true });
  exports.refineDiscriminatedUnion = void 0;
  var refineDiscriminatedUnion_js_1 = require('./refineDiscriminatedUnion.js');
  Object.defineProperty(exports, 'refineDiscriminatedUnion', {
    enumerable: true,
    get: function () {
      return refineDiscriminatedUnion_js_1.refineDiscriminatedUnion;
    },
  });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxxREFBcUQ7Ozs7Ozs7Ozs7Ozs7SUFFckQsNkVBQXlFO0lBQWhFLHVJQUFBLHdCQUF3QixPQUFBIn0=


