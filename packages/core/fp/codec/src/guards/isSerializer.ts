// @resultsafe/core-fp-codec/src/guards/isSerializer.ts

import type { Serializer } from '@resultsafe/core-fp-codec';

export const isSerializer = <T>(x: unknown): x is Serializer<T> =>
  typeof x === 'object' && x !== null && 'serialize' in x;


