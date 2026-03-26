// @resultsafe/core-fp-codec/src/types/Serializer.ts

export type Serializer<T> = {
  readonly serialize: (output: T) => string;
};


