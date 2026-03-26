export const FP_TYPE_NAMES = {
  // Option types
  OPTION_INTERFACE: 'Option' as const,
  SOME_INTERFACE: 'Some' as const,
  NONE_INTERFACE: 'None' as const,

  // Result types
  RESULT_INTERFACE: 'Result' as const,
  OK_INTERFACE: 'Ok' as const,
  ERR_INTERFACE: 'Err' as const,

  // Union types
  VARIANT_INTERFACE: 'Variant' as const,
  DISCRIMINATED_UNION_INTERFACE: 'DiscriminatedUnion' as const,
} as const;
