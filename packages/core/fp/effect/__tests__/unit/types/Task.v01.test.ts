// @resultsafe/core-fp-task/src/types/Task.ts

/**
 * @description
 * [EN] Represents an asynchronous computation that yields a value of type T<br/>
 * [RU] Представляет асинхронное вычисление, которое возвращает значение типа T<br/>
 *
 * @template T - [EN] The type of the yielded value<br/> [RU] Тип возвращаемого значения<br/>
 *
 * @example
 * ```ts
 * import { Task } from '@resultsafe/core-fp-task';
 *
 * const task: Task<number> = async () => 42;
 * ```
 */
export type Task<T> = () => Promise<T>;


