// @resultsafe/core-fp-codec/src/types/Branded.ts

// Уникальный символ-ключ — невозможно подделать, как в Rust PhantomData
export declare const __Brand: unique symbol;

/**
 * Creates a nominal (branded) type — impossible to construct accidentally.
 * Usage:
 *   type UserId = Branded<string, 'UserId'>;
 *   const id = "123" as UserId; // OK only with assertion
 */
export type Branded<T, B extends string> = T & {
  readonly [__Brand]: B;
};


