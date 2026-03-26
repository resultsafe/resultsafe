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
    exports.isOkOfType = void 0;
    var isOkOfType = function (variantMap) {
        return function (value, validators) {
            // Простая проверка без createResultValidator
            return (typeof value === 'object' &&
                value !== null &&
                'type' in value &&
                value.type === 'ok');
        };
    };
    exports.isOkOfType = isOkOfType;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaXNPa09mVHlwZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImlzT2tPZlR5cGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0lBSU8sSUFBTSxVQUFVLEdBQ3JCLFVBQTJDLFVBQWdCO1FBQzNELE9BQUEsVUFDRSxLQUFjLEVBQ2QsVUFTQztZQUVELDZDQUE2QztZQUM3QyxPQUFPLENBQ0wsT0FBTyxLQUFLLEtBQUssUUFBUTtnQkFDekIsS0FBSyxLQUFLLElBQUk7Z0JBQ2QsTUFBTSxJQUFJLEtBQUs7Z0JBQ2QsS0FBNEIsQ0FBQyxJQUFJLEtBQUssSUFBSSxDQUM1QyxDQUFDO1FBQ0osQ0FBQztJQXBCRCxDQW9CQyxDQUFDO0lBdEJTLFFBQUEsVUFBVSxjQXNCbkIifQ==