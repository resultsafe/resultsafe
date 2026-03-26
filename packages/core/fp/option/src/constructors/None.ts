import type { Option } from '@resultsafe/core-fp-option-shared';

export const None = { some: false } as const satisfies Option<never>;


