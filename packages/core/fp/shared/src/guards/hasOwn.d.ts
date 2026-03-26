/**
 * [EN] Type guard to check if object has own property
 * [RU] Тип-гард для проверки наличия собственного свойства у объекта
 */
export declare const hasOwn: <T extends object, K extends PropertyKey>(obj: T, key: K) => key is K & keyof T;
