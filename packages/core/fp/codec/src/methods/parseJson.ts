// @resultsafe/core-fp-codec/src/methods/parseJson.ts

import type { Codec } from '@resultsafe/core-fp-codec';
import type { Result } from '@resultsafe/core-fp-result';

export const parseJson = <T>(
  codec: Codec<T>,
  json: string,
): Result<T, string> => {
  let parsed: unknown;
  try {
    parsed = JSON.parse(json);
  } catch (e) {
    return { ok: false, error: 'Invalid JSON' };
  }
  return codec.decode(parsed);
};


