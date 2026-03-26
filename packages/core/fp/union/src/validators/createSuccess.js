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
    exports.createSuccess = void 0;
    var createSuccess = function (data) {
        return ({
            success: true,
            data: data,
        });
    };
    exports.createSuccess = createSuccess;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3JlYXRlU3VjY2Vzcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImNyZWF0ZVN1Y2Nlc3MudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0lBR08sSUFBTSxhQUFhLEdBQUcsVUFBSSxJQUFPO1FBQ3RDLE9BQUEsQ0FBQztZQUNDLE9BQU8sRUFBRSxJQUFJO1lBQ2IsSUFBSSxNQUFBO1NBQ0wsQ0FBVTtJQUhYLENBR1csQ0FBQztJQUpELFFBQUEsYUFBYSxpQkFJWiJ9