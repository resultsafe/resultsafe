// @resultsafe/core-fp-pipe/src/methods/pipe3.ts

export const pipe3 = <A, B, C, D>(
  a: A,
  ab: (a: A) => B,
  bc: (b: B) => C,
  cd: (c: C) => D,
): D => cd(bc(ab(a)));


