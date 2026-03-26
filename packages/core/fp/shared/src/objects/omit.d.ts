/**
 * [EN] Returns a new object with specified keys omitted
 * [RU] Возвращает новый объект с исключёнными указанными ключами
 */
export declare const omit: <T extends object, K extends keyof T>(obj: T, ...keys: K[]) => Omit<T, K>;
