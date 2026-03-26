import type { Option } from '@resultsafe/core-fp-option-shared';

export const isSome = <T>(
  option: Option<T>,
): option is { readonly some: true; readonly value: T } => option.some === true;


