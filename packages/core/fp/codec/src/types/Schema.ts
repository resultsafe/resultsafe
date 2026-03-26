// @resultsafe/core-fp-codec/src/types/Schema.ts

import type { Codec } from './Codec.js';
import type { Meta } from './Meta.js';

export type Schema<T> = Codec<T> & {
  readonly meta: Meta<T>;
};


