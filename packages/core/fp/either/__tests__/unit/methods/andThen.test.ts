// __tests__/methods/andThen.test.ts
import { Left, Right, andThen } from '@resultsafe/core-fp-either';
import { describe, expect, it } from 'vitest';

// __tests__/methods/andThen.test.ts

describe('andThen', () => {
  it('✅ chains Right value / цепочка Right значения', () => {
    const either = Right(5);
    const chained = andThen(either, (x) => Right(x * 2));

    expect(chained).toEqual({ _tag: 'Right', right: 10 });
  });

  it('❌ leaves Left unchanged / оставляет Left без изменений', () => {
    const either = Left('error');
    const chained = andThen(either, (x) => Right(x * 2));

    expect(chained).toEqual({ _tag: 'Left', left: 'error' });
  });

  it('✅ chains multiple operations / цепочка нескольких операций', () => {
    const either = Right(5);
    const chained = andThen(either, (x) =>
      andThen(Right(x * 2), (y) =>
        andThen(Right(y + 1), (z) => Right(z.toString())),
      ),
    );

    expect(chained).toEqual({ _tag: 'Right', right: '11' });
  });

  it('❌ stops chaining on Left / останавливает цепочку на Left', () => {
    const either = Right(5);
    const chained = andThen(either, (x) =>
      andThen(
        Right(x * 2),
        (y) => andThen(Left('stop'), (_z) => Right('never reached')), // ✅ _z — never — не используем
      ),
    );

    expect(chained).toEqual({ _tag: 'Left', left: 'stop' });
  });
});


