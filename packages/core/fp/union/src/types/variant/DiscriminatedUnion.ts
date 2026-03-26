// @resultsafe/core-fp-union/src/types/DiscriminatedUnion.ts

export type DiscriminatedUnion<TType extends string = string> = {
  readonly type: TType;
};


