// @resultsafe/core-fp-codec/src/types/.ts

export type Guard<T> = {
  readonly guard: (input: unknown) => input is T;
};


