// @resultsafe/core-fp-union/src/utils/matching/matchDiscriminatedUnion.ts
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
  exports.matchDiscriminatedUnion = void 0;
  var matchDiscriminatedUnion = function (value, cases) {
    var fn = cases[value.type];
    if (fn) {
      return fn(value);
    }
    throw new Error('Unhandled variant: '.concat(value.type));
  };
  exports.matchDiscriminatedUnion = matchDiscriminatedUnion;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWF0Y2hEaXNjcmltaW5hdGVkVW5pb24uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJtYXRjaERpc2NyaW1pbmF0ZWRVbmlvbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxxRUFBcUU7Ozs7Ozs7Ozs7Ozs7SUFJOUQsSUFBTSx1QkFBdUIsR0FBRyxVQUtyQyxLQUFRLEVBQ1IsS0FBVztRQUVYLElBQU0sRUFBRSxHQUFHLEtBQUssQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDN0IsSUFBSSxFQUFFLEVBQUUsQ0FBQztZQUNQLE9BQU8sRUFBRSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ25CLENBQUM7UUFDRCxNQUFNLElBQUksS0FBSyxDQUFDLDZCQUFzQixLQUFLLENBQUMsSUFBSSxDQUFFLENBQUMsQ0FBQztJQUN0RCxDQUFDLENBQUM7SUFiVyxRQUFBLHVCQUF1QiwyQkFhbEMifQ==


