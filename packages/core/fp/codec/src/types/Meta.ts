// @resultsafe/core-fp-codec/src/types/Meta.ts

export type Meta<T> = {
  readonly description?: string;
  readonly examples?: readonly T[];
  readonly [key: string]: unknown;
};


