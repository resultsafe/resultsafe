// @resultsafe/core-fp-union/src/types/ExcludeField.ts

export type ExcludeField<TForbidden extends string | undefined> =
  TForbidden extends string ? { [K in TForbidden]?: never } : {};


