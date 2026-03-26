// @resultsafe/core-fp-union/src/utils/matching/matchDiscriminatedUnionStrict.ts
(function (factory) {
  if (typeof module === 'object' && typeof module.exports === 'object') {
    var v = factory(require, exports);
    if (v !== undefined) module.exports = v;
  } else if (typeof define === 'function' && define.amd) {
    define(['require', 'exports'], factory);
  }
})(function (require, exports) {
  'use strict';
  Object.defineProperty(exports, '__esModule', { value: true });
  exports.matchDiscriminatedUnionStrict = void 0;
  var matchDiscriminatedUnionStrict = function (value, cases) {
    var handler = cases[value.type];
    if (!handler) {
      throw new Error('Unhandled variant: '.concat(value.type));
    }
    return handler(value);
  };
  exports.matchDiscriminatedUnionStrict = matchDiscriminatedUnionStrict;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWF0Y2hEaXNjcmltaW5hdGVkVW5pb25TdHJpY3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJtYXRjaERpc2NyaW1pbmF0ZWRVbmlvblN0cmljdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSwyRUFBMkU7Ozs7Ozs7Ozs7Ozs7SUFJcEUsSUFBTSw2QkFBNkIsR0FBRyxVQUkzQyxLQUFRLEVBQ1IsS0FFQztRQUVELElBQU0sT0FBTyxHQUFHLEtBQUssQ0FBQyxLQUFLLENBQUMsSUFBaUIsQ0FBQyxDQUFDO1FBQy9DLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQztZQUNiLE1BQU0sSUFBSSxLQUFLLENBQUMsNkJBQXNCLEtBQUssQ0FBQyxJQUFJLENBQUUsQ0FBQyxDQUFDO1FBQ3RELENBQUM7UUFDRCxPQUFPLE9BQU8sQ0FBQyxLQUFZLENBQUMsQ0FBQztJQUMvQixDQUFDLENBQUM7SUFkVyxRQUFBLDZCQUE2QixpQ0FjeEMifQ==


