// src/functions/pipe.ts
/**
 * [EN] Pipe function for composing functions left-to-right (supports up to 5 functions)
 * [RU] Функция pipe для композиции функций слева направо (поддерживает до 5 функций)
 */

export const pipe = <A, B>(a: A, ab: (a: A) => B): B => ab(a);

export const pipe2 = <A, B, C>(a: A, ab: (a: A) => B, bc: (b: B) => C): C =>
  bc(ab(a));

export const pipe3 = <A, B, C, D>(
  a: A,
  ab: (a: A) => B,
  bc: (b: B) => C,
  cd: (c: C) => D,
): D => cd(bc(ab(a)));

export const pipe4 = <A, B, C, D, E>(
  a: A,
  ab: (a: A) => B,
  bc: (b: B) => C,
  cd: (c: C) => D,
  de: (d: D) => E,
): E => de(cd(bc(ab(a))));

export const pipe5 = <A, B, C, D, E, F>(
  a: A,
  ab: (a: A) => B,
  bc: (b: B) => C,
  cd: (c: C) => D,
  de: (d: D) => E,
  ef: (e: E) => F,
): F => ef(de(cd(bc(ab(a)))));
