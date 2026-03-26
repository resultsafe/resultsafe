// @resultsafe/core-fp-effect/src/types/Effect.ts

import type { Result } from '@resultsafe/core-fp-result';

export type Effect<R, E, T> = (context: R) => Promise<Result<T, E>>;


