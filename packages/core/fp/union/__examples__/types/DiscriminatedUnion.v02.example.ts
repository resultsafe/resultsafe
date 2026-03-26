import type { DiscriminatedUnion } from '../../src/types/variant/DiscriminatedUnion.js';

// Можно создать более специфичные базовые типы
export type ActionBase<TType extends string> = DiscriminatedUnion<TType> & {
  readonly timestamp?: number;
  readonly meta?: Record<string, unknown>;
};

// Или с constraint для определенных префиксов
export type ApiAction<TType extends `API_${string}`> =
  DiscriminatedUnion<TType>;
