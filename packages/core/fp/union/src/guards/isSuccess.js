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
    exports.isSuccess = void 0;
    var isSuccess = function (variantMap) {
        return function (value) {
            // Простая реализация без validators
            return (typeof value === 'object' &&
                value !== null &&
                'type' in value &&
                value.type === 'success');
        };
    };
    exports.isSuccess = isSuccess;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaXNTdWNjZXNzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiaXNTdWNjZXNzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztJQUlPLElBQU0sU0FBUyxHQUNwQixVQUFnRCxVQUFnQjtRQUNoRSxPQUFBLFVBQUMsS0FBYztZQUNiLG9DQUFvQztZQUNwQyxPQUFPLENBQ0wsT0FBTyxLQUFLLEtBQUssUUFBUTtnQkFDekIsS0FBSyxLQUFLLElBQUk7Z0JBQ2QsTUFBTSxJQUFJLEtBQUs7Z0JBQ2QsS0FBNEIsQ0FBQyxJQUFJLEtBQUssU0FBUyxDQUNqRCxDQUFDO1FBQ0osQ0FBQztJQVJELENBUUMsQ0FBQztJQVZTLFFBQUEsU0FBUyxhQVVsQiJ9