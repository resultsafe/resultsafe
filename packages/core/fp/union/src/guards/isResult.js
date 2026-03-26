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
    exports.isResult = void 0;
    var isResult = function (variantMap) {
        return function (value) {
            // Простая проверка без createResultValidator
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
    exports.isResult = isResult;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaXNSZXN1bHQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpc1Jlc3VsdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7SUFJTyxJQUFNLFFBQVEsR0FDbkIsVUFBNkMsVUFBZ0I7UUFDN0QsT0FBQSxVQUFDLEtBQWM7WUFDYiw2Q0FBNkM7WUFDN0MsSUFDRSxPQUFPLEtBQUssS0FBSyxRQUFRO2dCQUN6QixLQUFLLEtBQUssSUFBSTtnQkFDZCxDQUFDLENBQUMsTUFBTSxJQUFJLEtBQUssQ0FBQztnQkFDbEIsT0FBUSxLQUE0QixDQUFDLElBQUksS0FBSyxRQUFRLEVBQ3RELENBQUM7Z0JBQ0QsT0FBTyxLQUFLLENBQUM7WUFDZixDQUFDO1lBRUQsSUFBTSxJQUFJLEdBQUksS0FBMEIsQ0FBQyxJQUFJLENBQUM7WUFDOUMsT0FBTyxJQUFJLElBQUksVUFBVSxDQUFDO1FBQzVCLENBQUM7SUFiRCxDQWFDLENBQUM7SUFmUyxRQUFBLFFBQVEsWUFlakIifQ==