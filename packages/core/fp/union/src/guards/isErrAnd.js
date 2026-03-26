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
    exports.isErrAnd = void 0;
    var isErrAnd = function (variantMap) {
        return function (and) {
            return function (value) {
                // Простая проверка
                if (typeof value !== 'object' ||
                    value === null ||
                    !('type' in value) ||
                    value.type !== 'err') {
                    return false;
                }
                // Применяем дополнительный предикат
                return and(value);
            };
        };
    };
    exports.isErrAnd = isErrAnd;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaXNFcnJBbmQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpc0VyckFuZC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7SUFJTyxJQUFNLFFBQVEsR0FDbkIsVUFBNEMsVUFBZ0I7UUFDNUQsT0FBQSxVQUNFLEdBQTREO1lBRTlELE9BQUEsVUFBQyxLQUFjO2dCQUNiLG1CQUFtQjtnQkFDbkIsSUFDRSxPQUFPLEtBQUssS0FBSyxRQUFRO29CQUN6QixLQUFLLEtBQUssSUFBSTtvQkFDZCxDQUFDLENBQUMsTUFBTSxJQUFJLEtBQUssQ0FBQztvQkFDakIsS0FBNEIsQ0FBQyxJQUFJLEtBQUssS0FBSyxFQUM1QyxDQUFDO29CQUNELE9BQU8sS0FBSyxDQUFDO2dCQUNmLENBQUM7Z0JBRUQsb0NBQW9DO2dCQUNwQyxPQUFPLEdBQUcsQ0FBQyxLQUF5QixDQUFDLENBQUM7WUFDeEMsQ0FBQztRQWJELENBYUM7SUFoQkQsQ0FnQkMsQ0FBQztJQWxCUyxRQUFBLFFBQVEsWUFrQmpCIn0=