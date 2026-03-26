var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "../utils/object/index.js", "./createError.js", "./createSuccess.js"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.createResultValidator = void 0;
    var index_js_1 = require("../utils/object/index.js");
    var createError_js_1 = require("./createError.js");
    var createSuccess_js_1 = require("./createSuccess.js");
    var createResultValidator = function (variantMap) {
        var getVariantConfig = function (variant) {
            return (0, index_js_1.hasOwn)(variantMap, variant) ? variantMap[variant] : undefined;
        };
        var isValidVariant = function (value) {
            return typeof value === 'string' && (0, index_js_1.hasOwn)(variantMap, value);
        };
        var validateStructure = function (value) {
            if (!(0, index_js_1.isObject)(value)) {
                return (0, createError_js_1.createError)('NOT_OBJECT', 'Value must be an object');
            }
            if (!(0, index_js_1.hasOwn)(value, 'type')) {
                return (0, createError_js_1.createError)('MISSING_TYPE', 'Object must have a "type" property');
            }
            if (typeof value['type'] !== 'string') {
                return (0, createError_js_1.createError)('INVALID_TYPE', 'Type property must be a string');
            }
            return (0, createSuccess_js_1.createSuccess)(value);
        };
        var validateVariant = function (variant) {
            if (!isValidVariant(variant)) {
                return (0, createError_js_1.createError)('UNKNOWN_VARIANT', "Unknown variant: ".concat(variant), {
                    variant: variant,
                });
            }
            return (0, createSuccess_js_1.createSuccess)(variant);
        };
        var validatePayloadFields = function (obj, variant, config) {
            var payload = config.payload;
            if (payload === 'never') {
                return (0, createSuccess_js_1.createSuccess)(undefined);
            }
            var requiredKeys = typeof payload === 'string' ? [payload] : payload;
            for (var _i = 0, requiredKeys_1 = requiredKeys; _i < requiredKeys_1.length; _i++) {
                var key = requiredKeys_1[_i];
                if (!(0, index_js_1.hasOwn)(obj, key)) {
                    return (0, createError_js_1.createError)('MISSING_FIELD', "Missing required field: ".concat(key), {
                        field: key,
                        variant: String(variant),
                    });
                }
            }
            return (0, createSuccess_js_1.createSuccess)(undefined);
        };
        var validateForbiddenFields = function (obj, config) {
            if (config.forbidden && (0, index_js_1.hasOwn)(obj, config.forbidden)) {
                return (0, createError_js_1.createError)('FORBIDDEN_FIELD', "Forbidden field present: ".concat(config.forbidden), { field: config.forbidden });
            }
            return (0, createSuccess_js_1.createSuccess)(undefined);
        };
        var validateStrictFields = function (obj, config) {
            if (!config.strictFields) {
                return (0, createSuccess_js_1.createSuccess)(undefined);
            }
            var allowedFields = new Set(['type']);
            if (config.forbidden) {
                allowedFields.add(config.forbidden);
            }
            if (config.payload !== 'never') {
                var payloadKeys = typeof config.payload === 'string' ? [config.payload] : config.payload;
                payloadKeys.forEach(function (key) { return allowedFields.add(key); });
            }
            var extraFields = Object.keys(obj).filter(function (key) { return !allowedFields.has(key); });
            if (extraFields.length > 0) {
                var firstField = extraFields[0];
                if (firstField !== undefined) {
                    return (0, createError_js_1.createError)('UNEXPECTED_FIELD', "Unexpected fields: ".concat(extraFields.join(', ')), { field: firstField });
                }
                return (0, createError_js_1.createError)('UNEXPECTED_FIELD', "Unexpected fields: ".concat(extraFields.join(', ')));
            }
            return (0, createSuccess_js_1.createSuccess)(undefined);
        };
        var validateWithValidators = function (obj, variant, validators) {
            if (!validators) {
                return (0, createSuccess_js_1.createSuccess)(undefined);
            }
            for (var _i = 0, _a = Object.entries(validators); _i < _a.length; _i++) {
                var _b = _a[_i], key = _b[0], validator = _b[1];
                if ((0, index_js_1.hasOwn)(obj, key) && validator) {
                    if (!(0, index_js_1.safeValidate)(validator, obj[key])) {
                        return (0, createError_js_1.createError)('VALIDATION_FAILED', "Validation failed for field: ".concat(key), { field: key, variant: String(variant) });
                    }
                }
            }
            return (0, createSuccess_js_1.createSuccess)(undefined);
        };
        var validateCommon = function (obj, variant, config, validators) {
            var payloadResult = validatePayloadFields(obj, variant, config);
            if (!payloadResult.success)
                return payloadResult;
            var forbiddenResult = validateForbiddenFields(obj, config);
            if (!forbiddenResult.success)
                return forbiddenResult;
            var strictResult = validateStrictFields(obj, config);
            if (!strictResult.success)
                return strictResult;
            var validatorsResult = validateWithValidators(obj, variant, validators);
            if (!validatorsResult.success)
                return validatorsResult;
            return (0, createSuccess_js_1.createSuccess)(undefined);
        };
        var isResult = function (value, validators) {
            var structureResult = validateStructure(value);
            if (!structureResult.success)
                return false;
            var obj = structureResult.data;
            var variantResult = validateVariant(obj['type']);
            if (!variantResult.success)
                return false;
            var variant = variantResult.data;
            var config = getVariantConfig(variant);
            var commonResult = validateCommon(obj, variant, config, validators === null || validators === void 0 ? void 0 : validators[variant]);
            return commonResult.success;
        };
        var createVariantPredicates = function () {
            var predicates = {};
            var _loop_1 = function (variant) {
                var predicateName = "is".concat(String(variant).charAt(0).toUpperCase()).concat(String(variant).slice(1));
                predicates[predicateName] = function (value, validators) {
                    var structureResult = validateStructure(value);
                    if (!structureResult.success)
                        return false;
                    var obj = structureResult.data;
                    if (obj['type'] !== variant)
                        return false;
                    var config = getVariantConfig(variant);
                    if (!config)
                        return false;
                    var commonResult = validateCommon(obj, variant, config, validators);
                    return commonResult.success;
                };
            };
            for (var _i = 0, _a = Object.keys(variantMap); _i < _a.length; _i++) {
                var variant = _a[_i];
                _loop_1(variant);
            }
            return predicates;
        };
        return __assign(__assign({ isResult: isResult }, createVariantPredicates()), { validateResult: function (value) {
                var structureResult = validateStructure(value);
                if (!structureResult.success)
                    return structureResult;
                var obj = structureResult.data;
                var variantResult = validateVariant(obj['type']);
                if (!variantResult.success)
                    return variantResult;
                var variant = variantResult.data;
                var config = getVariantConfig(variant);
                var commonResult = validateCommon(obj, variant, config);
                if (!commonResult.success)
                    return commonResult;
                return (0, createSuccess_js_1.createSuccess)(obj);
            }, getVariantConfig: getVariantConfig, getSupportedVariants: function () {
                return Object.keys(variantMap);
            } });
    };
    exports.createResultValidator = createResultValidator;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3JlYXRlUmVzdWx0VmFsaWRhdG9yLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiY3JlYXRlUmVzdWx0VmFsaWRhdG9yLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0lBUUEscURBQTBFO0lBQzFFLG1EQUErQztJQUMvQyx1REFBbUQ7SUFFNUMsSUFBTSxxQkFBcUIsR0FBRyxVQUduQyxVQUFzQjtRQUV0QixJQUFNLGdCQUFnQixHQUFHLFVBQ3ZCLE9BQVU7WUFFVixPQUFPLElBQUEsaUJBQU0sRUFBQyxVQUFVLEVBQUUsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDO1FBQ3ZFLENBQUMsQ0FBQztRQUVGLElBQU0sY0FBYyxHQUFHLFVBQUMsS0FBYztZQUNwQyxPQUFPLE9BQU8sS0FBSyxLQUFLLFFBQVEsSUFBSSxJQUFBLGlCQUFNLEVBQUMsVUFBVSxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBQ2hFLENBQUMsQ0FBQztRQUVGLElBQU0saUJBQWlCLEdBQUcsVUFDeEIsS0FBYztZQUVkLElBQUksQ0FBQyxJQUFBLG1CQUFRLEVBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQztnQkFDckIsT0FBTyxJQUFBLDRCQUFXLEVBQUMsWUFBWSxFQUFFLHlCQUF5QixDQUFDLENBQUM7WUFDOUQsQ0FBQztZQUVELElBQUksQ0FBQyxJQUFBLGlCQUFNLEVBQUMsS0FBSyxFQUFFLE1BQU0sQ0FBQyxFQUFFLENBQUM7Z0JBQzNCLE9BQU8sSUFBQSw0QkFBVyxFQUFDLGNBQWMsRUFBRSxvQ0FBb0MsQ0FBQyxDQUFDO1lBQzNFLENBQUM7WUFFRCxJQUFJLE9BQU8sS0FBSyxDQUFDLE1BQU0sQ0FBQyxLQUFLLFFBQVEsRUFBRSxDQUFDO2dCQUN0QyxPQUFPLElBQUEsNEJBQVcsRUFBQyxjQUFjLEVBQUUsZ0NBQWdDLENBQUMsQ0FBQztZQUN2RSxDQUFDO1lB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