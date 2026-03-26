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
    exports.isVariantAnd = void 0;
    var isVariantAnd = function (variantMap) {
        return function (variant, and, validators) {
            return function (value) {
                // 1) Базовая структурная проверка
                if (typeof value !== 'object' ||
                    value === null ||
                    !('type' in value) ||
                    value.type !== variant ||
                    !(variant in variantMap)) {
                    return false;
                }
                // 2) Применяем валидаторы (если заданы)
                if (validators) {
                    var entries = Object.entries(validators);
                    for (var _i = 0, entries_1 = entries; _i < entries_1.length; _i++) {
                        var _a = entries_1[_i], key = _a[0], check = _a[1];
                        if (!check)
                            continue;
                        var obj = value;
                        if (!Object.prototype.hasOwnProperty.call(obj, key))
                            return false;
                        if (!check(obj[key]))
                            return false;
                    }
                }
                // 3) Пользовательское дополнительное сужение
                return and(value);
            };
        };
    };
    exports.isVariantAnd = isVariantAnd;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaXNWYXJpYW50QW5kLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiaXNWYXJpYW50QW5kLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztJQU9PLElBQU0sWUFBWSxHQUN2QixVQUE2QyxVQUFnQjtRQUM3RCxPQUFBLFVBQ0UsT0FBVSxFQUNWLEdBQTBFLEVBQzFFLFVBQXNDO1lBRXhDLE9BQUEsVUFBQyxLQUFjO2dCQUNiLGtDQUFrQztnQkFDbEMsSUFDRSxPQUFPLEtBQUssS0FBSyxRQUFRO29CQUN6QixLQUFLLEtBQUssSUFBSTtvQkFDZCxDQUFDLENBQUMsTUFBTSxJQUFJLEtBQUssQ0FBQztvQkFDakIsS0FBNEIsQ0FBQyxJQUFJLEtBQUssT0FBTztvQkFDOUMsQ0FBQyxDQUFDLE9BQU8sSUFBSSxVQUFVLENBQUMsRUFDeEIsQ0FBQztvQkFDRCxPQUFPLEtBQUssQ0FBQztnQkFDZixDQUFDO2dCQUVELHdDQUF3QztnQkFDeEMsSUFBSSxVQUFVLEVBQUUsQ0FBQztvQkFDZixJQUFNLE9BQU8sR0FBRyxNQUFNLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FFeEMsQ0FBQztvQkFFRixLQUEyQixVQUFPLEVBQVAsbUJBQU8sRUFBUCxxQkFBTyxFQUFQLElBQU8sRUFBRSxDQUFDO3dCQUExQixJQUFBLGtCQUFZLEVBQVgsR0FBRyxRQUFBLEVBQUUsS0FBSyxRQUFBO3dCQUNwQixJQUFJLENBQUMsS0FBSzs0QkFBRSxTQUFTO3dCQUNyQixJQUFNLEdBQUcsR0FBRyxLQUFnQyxDQUFDO3dCQUM3QyxJQUFJLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxHQUFhLENBQUM7NEJBQzNELE9BQU8sS0FBSyxDQUFDO3dCQUNmLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLEdBQWEsQ0FBQyxDQUFDOzRCQUFFLE9BQU8sS0FBSyxDQUFDO29CQUMvQyxDQUFDO2dCQUNILENBQUM7Z0JBRUQsNkNBQTZDO2dCQUM3QyxPQUFPLEdBQUcsQ0FBQyxLQUFnQyxDQUFDLENBQUM7WUFDL0MsQ0FBQztRQTdCRCxDQTZCQztJQWxDRCxDQWtDQyxDQUFDO0lBcENTLFFBQUEsWUFBWSxnQkFvQ3JCIn0=