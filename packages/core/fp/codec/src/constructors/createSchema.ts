// @resultsafe/core-fp-codec/src/constructors/createSchema.ts

import type { Codec, Meta, Schema } from '@resultsafe/core-fp-codec';

export const createSchema = <T>(codec: Codec<T>, meta: Meta<T>): Schema<T> => ({
  ...codec,
  meta,
});


