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
    exports.isFailure = void 0;
    var isFailure = function (variantMap) {
        return function (value, validators) {
            // Простая проверка без createResultValidator
            return (typeof value === 'object' &&
                value !== null &&
                'type' in value &&
                value.type === 'failure');
        };
    };
    exports.isFailure = isFailure;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaXNGYWlsdXJlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiaXNGYWlsdXJlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztJQUlPLElBQU0sU0FBUyxHQUNwQixVQUFnRCxVQUFnQjtRQUNoRSxPQUFBLFVBQ0UsS0FBYyxFQUNkLFVBU0M7WUFFRCw2Q0FBNkM7WUFDN0MsT0FBTyxDQUNMLE9BQU8sS0FBSyxLQUFLLFFBQVE7Z0JBQ3pCLEtBQUssS0FBSyxJQUFJO2dCQUNkLE1BQU0sSUFBSSxLQUFLO2dCQUNkLEtBQTRCLENBQUMsSUFBSSxLQUFLLFNBQVMsQ0FDakQsQ0FBQztRQUNKLENBQUM7SUFwQkQsQ0FvQkMsQ0FBQztJQXRCUyxRQUFBLFNBQVMsYUFzQmxCIn0=