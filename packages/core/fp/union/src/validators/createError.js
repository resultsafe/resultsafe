var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.createError = void 0;
    var createError = function (code, message, details) {
        return ({
            success: false,
            error: __assign({ code: code, message: message }, details),
        });
    };
    exports.createError = createError;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3JlYXRlRXJyb3IuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJjcmVhdGVFcnJvci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztJQUlPLElBQU0sV0FBVyxHQUFHLFVBQ3pCLElBQTZCLEVBQzdCLE9BQWUsRUFDZixPQUE2RDtRQUU3RCxPQUFBLENBQUM7WUFDQyxPQUFPLEVBQUUsS0FBSztZQUNkLEtBQUssYUFDSCxJQUFJLE1BQUEsRUFDSixPQUFPLFNBQUEsSUFDSixPQUFPLENBQ1g7U0FDRixDQUFVO0lBUFgsQ0FPVyxDQUFDO0lBWkQsUUFBQSxXQUFXLGVBWVYifQ==