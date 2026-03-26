// @resultsafe/core-fp-pipe/src/methods/pipe6.ts

export const pipe6 = <A, B, C, D, E, F, G>(
  a: A,
  ab: (a: A) => B,
  bc: (b: B) => C,
  cd: (c: C) => D,
  de: (d: D) => E,
  ef: (e: E) => F,
  fg: (f: F) => G,
): G => fg(ef(de(cd(bc(ab(a))))));


