// @resultsafe/core-fp-pipe/src/methods/pipe4.ts

export const pipe4 = <A, B, C, D, E>(
  a: A,
  ab: (a: A) => B,
  bc: (b: B) => C,
  cd: (c: C) => D,
  de: (d: D) => E,
): E => de(cd(bc(ab(a))));


