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
    exports.isValidatedResult = void 0;
    var isValidatedResult = function (variantMap) {
        return function (value, validators) {
            // Простая проверка структуры без createResultValidator
            if (typeof value !== 'object' ||
                value === null ||
                !('type' in value) ||
                typeof value.type !== 'string') {
                return false;
            }
            var type = value.type;
            return type in variantMap;
        };
    };
    exports.isValidatedResult = isValidatedResult;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaXNWYWxpZGF0ZWRSZXN1bHQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpc1ZhbGlkYXRlZFJlc3VsdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7SUFJTyxJQUFNLGlCQUFpQixHQUM1QixVQUE2QyxVQUFnQjtRQUM3RCxPQUFBLFVBQ0UsS0FBYyxFQUNkLFVBV0U7WUFFRix1REFBdUQ7WUFDdkQsSUFDRSxPQUFPLEtBQUssS0FBSyxRQUFRO2dCQUN6QixLQUFLLEtBQUssSUFBSTtnQkFDZCxDQUFDLENBQUMsTUFBTSxJQUFJLEtBQUssQ0FBQztnQkFDbEIsT0FBUSxLQUE0QixDQUFDLElBQUksS0FBSyxRQUFRLEVBQ3RELENBQUM7Z0JBQ0QsT0FBTyxLQUFLLENBQUM7WUFDZixDQUFDO1lBRUQsSUFBTSxJQUFJLEdBQUksS0FBMEIsQ0FBQyxJQUFJLENBQUM7WUFDOUMsT0FBTyxJQUFJLElBQUksVUFBVSxDQUFDO1FBQzVCLENBQUM7SUEzQkQsQ0EyQkMsQ0FBQztJQTdCUyxRQUFBLGlCQUFpQixxQkE2QjFCIn0=