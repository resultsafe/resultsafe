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
    exports.isOkAnd = void 0;
    var isOkAnd = function (variantMap) {
        return function (and) {
            return function (value) {
                // Простая проверка без createResultValidator
                var isBasicOk = typeof value === 'object' &&
                    value !== null &&
                    'type' in value &&
                    value.type === 'ok';
                if (!isBasicOk)
                    return false;
                // Применяем дополнительный предикат
                return and(value);
            };
        };
    };
    exports.isOkAnd = isOkAnd;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaXNPa0FuZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImlzT2tBbmQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0lBSU8sSUFBTSxPQUFPLEdBQ2xCLFVBQTJDLFVBQWdCO1FBQzNELE9BQUEsVUFDRSxHQUEwRDtZQUU1RCxPQUFBLFVBQUMsS0FBYztnQkFDYiw2Q0FBNkM7Z0JBQzdDLElBQU0sU0FBUyxHQUNiLE9BQU8sS0FBSyxLQUFLLFFBQVE7b0JBQ3pCLEtBQUssS0FBSyxJQUFJO29CQUNkLE1BQU0sSUFBSSxLQUFLO29CQUNkLEtBQTRCLENBQUMsSUFBSSxLQUFLLElBQUksQ0FBQztnQkFFOUMsSUFBSSxDQUFDLFNBQVM7b0JBQUUsT0FBTyxLQUFLLENBQUM7Z0JBRTdCLG9DQUFvQztnQkFDcEMsT0FBTyxHQUFHLENBQUMsS0FBd0IsQ0FBQyxDQUFDO1lBQ3ZDLENBQUM7UUFaRCxDQVlDO0lBZkQsQ0FlQyxDQUFDO0lBakJTLFFBQUEsT0FBTyxXQWlCaEIifQ==