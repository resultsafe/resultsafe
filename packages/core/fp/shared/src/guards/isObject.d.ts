/**
 * [EN] Type guard to check if value is a non-null object (not array)
 * [RU] Тип-гард для проверки, что значение — не-null объект (не массив)
 */
export declare const isObject: (value: unknown) => value is Record<string, unknown>;
