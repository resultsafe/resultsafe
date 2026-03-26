// @resultsafe/core-fp-union/src/types/ValidatorFn.ts

export type ValidatorFn<T = unknown> = (x: unknown) => x is T;


