// @resultsafe/core-fp-codec/src/types/Encode.ts

export type Encode<T> = {
  readonly encode: (output: T) => unknown;
};


