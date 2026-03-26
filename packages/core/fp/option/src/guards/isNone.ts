import type { Option } from '@resultsafe/core-fp-option-shared';

export const isNone = <T>(
  option: Option<T>,
): option is { readonly some: false } => option.some === false;


