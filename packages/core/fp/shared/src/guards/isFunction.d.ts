/**
 * [EN] Type guard to check if value is a function
 * [RU] Тип-гард для проверки, что значение — функция
 */
export declare const isFunction: <T extends (...args: any[]) => any>(value: unknown) => value is T;
