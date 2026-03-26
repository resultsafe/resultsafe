// @resultsafe/core-fp-pipe/src/methods/pipe5.ts

export const pipe5 = <A, B, C, D, E, F>(
  a: A,
  ab: (a: A) => B,
  bc: (b: B) => C,
  cd: (c: C) => D,
  de: (d: D) => E,
  ef: (e: E) => F,
): F => ef(de(cd(bc(ab(a)))));


