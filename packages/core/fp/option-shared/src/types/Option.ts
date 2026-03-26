export type Option<T> =
  | { readonly some: true; readonly value: T }
  | { readonly some: false };
