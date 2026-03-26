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
    exports.isOk = void 0;
    var isOk = function (variantMap) {
        return function (value, validators) {
            // Простая проверка без createResultValidator
            return (typeof value === 'object' &&
                value !== null &&
                'type' in value &&
                value.type === 'ok');
        };
    };
    exports.isOk = isOk;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaXNPay5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImlzT2sudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0lBSU8sSUFBTSxJQUFJLEdBQ2YsVUFBMkMsVUFBZ0I7UUFDM0QsT0FBQSxVQUNFLEtBQWMsRUFDZCxVQVNDO1lBRUQsNkNBQTZDO1lBQzdDLE9BQU8sQ0FDTCxPQUFPLEtBQUssS0FBSyxRQUFRO2dCQUN6QixLQUFLLEtBQUssSUFBSTtnQkFDZCxNQUFNLElBQUksS0FBSztnQkFDZCxLQUE0QixDQUFDLElBQUksS0FBSyxJQUFJLENBQzVDLENBQUM7UUFDSixDQUFDO0lBcEJELENBb0JDLENBQUM7SUF0QlMsUUFBQSxJQUFJLFFBc0JiIn0=