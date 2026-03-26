// @resultsafe/core-fp-pipe/src/constructors/pipe.ts

export const pipe = <A, B>(a: A, ab: (a: A) => B): B => ab(a);


