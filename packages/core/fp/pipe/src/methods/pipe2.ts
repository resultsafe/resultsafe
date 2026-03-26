// @resultsafe/core-fp-pipe/src/methods/pipe2.ts

export const pipe2 = <A, B, C>(a: A, ab: (a: A) => B, bc: (b: B) => C): C =>
  bc(ab(a));


