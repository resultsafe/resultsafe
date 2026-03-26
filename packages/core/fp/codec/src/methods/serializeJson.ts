// @resultsafe/core-fp-codec/src/methods/serializeJson.ts

import type { Codec } from '@resultsafe/core-fp-codec';
import type { Result } from '@resultsafe/core-fp-result';

export const serializeJson = <T>(
  codec: Codec<T>,
  value: T,
): Result<string, string> => {
  try {
    const encoded = codec.encode(value);
    return { ok: true, value: JSON.stringify(encoded) };
  } catch (e) {
    return { ok: false, error: 'Serialization failed' };
  }
};


