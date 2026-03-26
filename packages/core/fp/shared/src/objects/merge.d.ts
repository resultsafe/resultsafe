/**
 * [EN] Deeply merges two objects (arrays are replaced, not merged)
 * [RU] Глубоко объединяет два объекта (массивы заменяются, а не объединяются)
 */
export declare const merge: <T extends object, U extends object>(target: T, source: U) => T & U;
