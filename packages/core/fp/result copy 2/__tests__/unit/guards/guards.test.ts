import { describe, expect, it, vi } from 'vitest';

import { isErr } from '../../../src/guards/isErr.js';
import { isErrAnd } from '../../../src/guards/isErrAnd.js';
import { isOk } from '../../../src/guards/isOk.js';
import { isOkAnd } from '../../../src/guards/isOkAnd.js';

describe('guards/isErr', () => {
  it('returns true only for Err variant', () => {
    expect(isErr({ ok: false, error: 'boom' })).toBe(true);
    expect(isErr({ ok: true, value: 1 })).toBe(false);
  });
});

describe('guards/isErrAnd', () => {
  it('evaluates predicate for Err values', () => {
    expect(
      isErrAnd({ ok: false, error: 'boom' }, (e) => e.startsWith('b')),
    ).toBe(true);
  });

  it('does not call predicate for Ok values', () => {
    const predicate = vi.fn(() => true);
    expect(isErrAnd({ ok: true, value: 1 }, predicate)).toBe(false);
    expect(predicate).not.toHaveBeenCalled();
  });
});

describe('guards/isOk', () => {
  it('returns true only for Ok variant', () => {
    expect(isOk({ ok: true, value: 1 })).toBe(true);
    expect(isOk({ ok: false, error: 'boom' })).toBe(false);
  });
});

describe('guards/isOkAnd', () => {
  it('evaluates predicate for Ok values', () => {
    expect(isOkAnd({ ok: true, value: 10 }, (v) => v > 5)).toBe(true);
  });

  it('does not call predicate for Err values', () => {
    const predicate = vi.fn(() => true);
    expect(isOkAnd({ ok: false, error: 'boom' }, predicate)).toBe(false);
    expect(predicate).not.toHaveBeenCalled();
  });
});
