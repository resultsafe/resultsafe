// @resultsafe/core-fp-codec/src/guards/isSchema.ts

import type { Schema } from '@resultsafe/core-fp-codec';
import { isCodec } from './isCodec.js';

export const isSchema = <T>(x: unknown): x is Schema<T> =>
  isCodec(x) && 'meta' in x;


