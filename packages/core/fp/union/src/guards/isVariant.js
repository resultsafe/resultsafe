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
    exports.isVariant = void 0;
    var isVariant = function (variantMap) {
        return function (variant) {
            return function (value) {
                // Простая проверка без createResultValidator
                return (typeof value === 'object' &&
                    value !== null &&
                    'type' in value &&
                    value.type === variant &&
                    variant in variantMap);
            };
        };
    };
    exports.isVariant = isVariant;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaXNWYXJpYW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiaXNWYXJpYW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztJQUlPLElBQU0sU0FBUyxHQUNwQixVQUE2QyxVQUFnQjtRQUM3RCxPQUFBLFVBQWdDLE9BQVU7WUFDMUMsT0FBQSxVQUFDLEtBQWM7Z0JBQ2IsNkNBQTZDO2dCQUM3QyxPQUFPLENBQ0wsT0FBTyxLQUFLLEtBQUssUUFBUTtvQkFDekIsS0FBSyxLQUFLLElBQUk7b0JBQ2QsTUFBTSxJQUFJLEtBQUs7b0JBQ2QsS0FBNEIsQ0FBQyxJQUFJLEtBQUssT0FBTztvQkFDOUMsT0FBTyxJQUFJLFVBQVUsQ0FDdEIsQ0FBQztZQUNKLENBQUM7UUFURCxDQVNDO0lBVkQsQ0FVQyxDQUFDO0lBWlMsUUFBQSxTQUFTLGFBWWxCIn0=