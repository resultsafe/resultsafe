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
    exports.isErrOfType = void 0;
    var isErrOfType = function (variantMap) {
        return function (value, validators) {
            // Простая проверка без createResultValidator
            if (typeof value !== 'object' ||
                value === null ||
                !('type' in value) ||
                value.type !== 'err') {
                return false;
            }
            // Здесь можно добавить валидацию payload если нужно
            // Но для простой проверки типа достаточно базовой проверки выше
            return true;
        };
    };
    exports.isErrOfType = isErrOfType;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaXNFcnJPZlR5cGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpc0Vyck9mVHlwZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7SUFJTyxJQUFNLFdBQVcsR0FDdEIsVUFBNEMsVUFBZ0I7UUFDNUQsT0FBQSxVQUNFLEtBQWMsRUFDZCxVQVNDO1lBRUQsNkNBQTZDO1lBQzdDLElBQ0UsT0FBTyxLQUFLLEtBQUssUUFBUTtnQkFDekIsS0FBSyxLQUFLLElBQUk7Z0JBQ2QsQ0FBQyxDQUFDLE1BQU0sSUFBSSxLQUFLLENBQUM7Z0JBQ2pCLEtBQTRCLENBQUMsSUFBSSxLQUFLLEtBQUssRUFDNUMsQ0FBQztnQkFDRCxPQUFPLEtBQUssQ0FBQztZQUNmLENBQUM7WUFFRCxvREFBb0Q7WUFDcEQsZ0VBQWdFO1lBRWhFLE9BQU8sSUFBSSxDQUFDO1FBQ2QsQ0FBQztJQTNCRCxDQTJCQyxDQUFDO0lBN0JTLFFBQUEsV0FBVyxlQTZCcEIifQ==