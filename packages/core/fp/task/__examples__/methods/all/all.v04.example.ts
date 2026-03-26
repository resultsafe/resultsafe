// @resultsafe/core-fp-task/src/methods/__tests__/all.types.test.ts
/**
 * Type-level tests for `all` (tuple inference)
 *
 * Эти проверки выявляют ошибки вывода типов при компиляции.
 * Запуск: `pnpm tsc -p tsconfig.json`
 *
 * ✅ Проверка tuple inference, union, пустого массива
 */

import { all } from '@resultsafe/core-fp-task';

type Task<T> = () => Promise<T>;

// 1) Разнотипные задачи -> tuple inference
const a: Task<number> = () => Promise.resolve(1);
const b: Task<string> = () => Promise.resolve('ok');

const combinedTuple = all([a, b] as const);
async function _typeChecks1(): Promise<void> {
  const [rNum, rStr] = await combinedTuple(); // rNum: number, rStr: string
  void rNum;
  void rStr;

  // @ts-expect-error
  const wrong: [string, number] = await combinedTuple(); // Ошибка: порядок неверен
}

// 2) Пустой массив -> Task<[]>
const combinedEmpty = all([] as const);
async function _typeChecks2(): Promise<void> {
  const result = await combinedEmpty(); // []
  void result;

  // @ts-expect-error нельзя присвоить массив number[]
  const bad: number[] = await combinedEmpty();
}

// 3) Однотипный массив -> tuple с одним элементом
const tnum: Task<number> = () => Promise.resolve(7);
const combinedNum = all([tnum] as const); // Task<[number]>
async function _typeChecks3(): Promise<void> {
  const [out] = await combinedNum(); // out: number
  void out;
}

// 4) Проверка двух однотипных задач
async function _typeChecks4(): Promise<void> {
  const both = all([
    () => Promise.resolve(1),
    () => Promise.resolve(2),
  ] as const); // Task<[number, number]>
  const [v0, v1] = await both();
  const n0: number = v0;
  const n1: number = v1;
  void n0;
  void n1;
}


