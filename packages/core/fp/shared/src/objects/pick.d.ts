/**
 * [EN] Returns a new object with only specified keys
 * [RU] Возвращает новый объект, содержащий только указанные ключи
 */
export declare const pick: <T extends object, K extends keyof T>(obj: T, ...keys: K[]) => Pick<T, K>;
