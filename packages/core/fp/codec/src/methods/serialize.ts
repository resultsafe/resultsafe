// @resultsafe/core-fp-codec/src/methods/serialize.ts

import type { Serializer } from '@resultsafe/core-fp-codec';

export const serialize = <T>(serializer: Serializer<T>, output: T): string =>
  serializer.serialize(output);


