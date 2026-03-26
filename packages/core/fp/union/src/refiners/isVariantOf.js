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
    exports.isVariantOf = void 0;
    var isRecord = function (x) {
        return typeof x === 'object' && x !== null;
    };
    var hasOwn = function (obj, key) {
        return Object.prototype.hasOwnProperty.call(obj, key);
    };
    var getPayloadKeys = function (config) {
        var p = config.payload;
        if (p === 'never')
            return [];
        return (Array.isArray(p) ? p : [p]);
    };
    var isVariantOf = function (variantMap) {
        return function (variant) {
            return function (value) {
                if (!isRecord(value))
                    return false;
                if (!hasOwn(value, 'type'))
                    return false;
                if (value['type'] !== variant)
                    return false;
                var config = variantMap[variant];
                if (!config)
                    return false;
                var keys = getPayloadKeys(config);
                for (var _i = 0, keys_1 = keys; _i < keys_1.length; _i++) {
                    var key = keys_1[_i];
                    if (!hasOwn(value, key))
                        return false;
                }
                return true;
            };
        };
    };
    exports.isVariantOf = isVariantOf;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaXNWYXJpYW50T2YuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpc1ZhcmlhbnRPZi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7SUFJQSxJQUFNLFFBQVEsR0FBRyxVQUFDLENBQVU7UUFDMUIsT0FBQSxPQUFPLENBQUMsS0FBSyxRQUFRLElBQUksQ0FBQyxLQUFLLElBQUk7SUFBbkMsQ0FBbUMsQ0FBQztJQUV0QyxJQUFNLE1BQU0sR0FBRyxVQUNiLEdBQTRCLEVBQzVCLEdBQU07UUFFTixPQUFBLE1BQU0sQ0FBQyxTQUFTLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDO0lBQTlDLENBQThDLENBQUM7SUFFakQsSUFBTSxjQUFjLEdBQUcsVUFDckIsTUFBUztRQUVULElBQU0sQ0FBQyxHQUFHLE1BQU0sQ0FBQyxPQUFPLENBQUM7UUFDekIsSUFBSSxDQUFDLEtBQUssT0FBTztZQUFFLE9BQU8sRUFBRSxDQUFDO1FBQzdCLE9BQU8sQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQThCLENBQUM7SUFDbkUsQ0FBQyxDQUFDO0lBRUssSUFBTSxXQUFXLEdBQ3RCLFVBQTZDLFVBQWdCO1FBQzdELE9BQUEsVUFBZ0MsT0FBVTtZQUMxQyxPQUFBLFVBQ0UsS0FBYztnQkFFZCxJQUFJLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQztvQkFBRSxPQUFPLEtBQUssQ0FBQztnQkFDbkMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLEVBQUUsTUFBTSxDQUFDO29CQUFFLE9BQU8sS0FBSyxDQUFDO2dCQUN6QyxJQUFJLEtBQUssQ0FBQyxNQUFNLENBQUMsS0FBSyxPQUFPO29CQUFFLE9BQU8sS0FBSyxDQUFDO2dCQUU1QyxJQUFNLE1BQU0sR0FBRyxVQUFVLENBQUMsT0FBTyxDQUFDLENBQUM7Z0JBQ25DLElBQUksQ0FBQyxNQUFNO29CQUFFLE9BQU8sS0FBSyxDQUFDO2dCQUUxQixJQUFNLElBQUksR0FBRyxjQUFjLENBQUMsTUFBTSxDQUFDLENBQUM7Z0JBQ3BDLEtBQWtCLFVBQUksRUFBSixhQUFJLEVBQUosa0JBQUksRUFBSixJQUFJLEVBQUUsQ0FBQztvQkFBcEIsSUFBTSxHQUFHLGFBQUE7b0JBQ1osSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLEVBQUUsR0FBRyxDQUFDO3dCQUFFLE9BQU8sS0FBSyxDQUFDO2dCQUN4QyxDQUFDO2dCQUVELE9BQU8sSUFBSSxDQUFDO1lBQ2QsQ0FBQztRQWhCRCxDQWdCQztJQWpCRCxDQWlCQyxDQUFDO0lBbkJTLFFBQUEsV0FBVyxlQW1CcEIifQ==