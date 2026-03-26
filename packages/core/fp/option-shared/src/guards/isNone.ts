import type { Option } from '../types/Option.js';

export declare const isNone: <T>(
  option: Option<T>,
) => option is { readonly some: false };
