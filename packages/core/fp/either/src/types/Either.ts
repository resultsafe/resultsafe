// @resultsafe/core-fp-either/src/types/Either.ts

export type Either<L, R> =
  | { readonly _tag: 'Left'; readonly left: L }
  | { readonly _tag: 'Right'; readonly right: R };


