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
    exports.isVariantOfType = void 0;
    var isVariantOfType = function (variantMap) {
        return function (variant, validators) {
            return function (value) {
                // Базовая проверка структуры без createResultValidator
                if (typeof value !== 'object' ||
                    value === null ||
                    !('type' in value) ||
                    value.type !== variant ||
                    !(variant in variantMap)) {
                    return false;
                }
                // Проверка валидаторов
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
                return true;
            };
        };
    };
    exports.isVariantOfType = isVariantOfType;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaXNWYXJpYW50T2ZUeXBlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiaXNWYXJpYW50T2ZUeXBlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztJQU9PLElBQU0sZUFBZSxHQUMxQixVQUE2QyxVQUFnQjtRQUM3RCxPQUFBLFVBQ0UsT0FBVSxFQUNWLFVBQXNDO1lBRXhDLE9BQUEsVUFBQyxLQUFjO2dCQUNiLHVEQUF1RDtnQkFDdkQsSUFDRSxPQUFPLEtBQUssS0FBSyxRQUFRO29CQUN6QixLQUFLLEtBQUssSUFBSTtvQkFDZCxDQUFDLENBQUMsTUFBTSxJQUFJLEtBQUssQ0FBQztvQkFDakIsS0FBNEIsQ0FBQyxJQUFJLEtBQUssT0FBTztvQkFDOUMsQ0FBQyxDQUFDLE9BQU8sSUFBSSxVQUFVLENBQUMsRUFDeEIsQ0FBQztvQkFDRCxPQUFPLEtBQUssQ0FBQztnQkFDZixDQUFDO2dCQUVELHVCQUF1QjtnQkFDdkIsSUFBSSxVQUFVLEVBQUUsQ0FBQztvQkFDZixJQUFNLE9BQU8sR0FBRyxNQUFNLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FFeEMsQ0FBQztvQkFFRixLQUEyQixVQUFPLEVBQVAsbUJBQU8sRUFBUCxxQkFBTyxFQUFQLElBQU8sRUFBRSxDQUFDO3dCQUExQixJQUFBLGtCQUFZLEVBQVgsR0FBRyxRQUFBLEVBQUUsS0FBSyxRQUFBO3dCQUNwQixJQUFJLENBQUMsS0FBSzs0QkFBRSxTQUFTO3dCQUNyQixJQUFNLEdBQUcsR0FBRyxLQUFnQyxDQUFDO3dCQUM3QyxJQUFJLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUM7NEJBQUUsT0FBTyxLQUFLLENBQUM7d0JBQ2xFLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDOzRCQUFFLE9BQU8sS0FBSyxDQUFDO29CQUNyQyxDQUFDO2dCQUNILENBQUM7Z0JBRUQsT0FBTyxJQUFJLENBQUM7WUFDZCxDQUFDO1FBM0JELENBMkJDO0lBL0JELENBK0JDLENBQUM7SUFqQ1MsUUFBQSxlQUFlLG1CQWlDeEIifQ==