/**
 * [EN] Constant function: returns a function that always returns the same value
 * [RU] Константная функция: возвращает функцию, которая всегда возвращает одно и то же значение
 */
export declare const constant: <T>(x: T) => () => T;
