import { describe, expect, it, vi } from 'vitest';

import { err } from '../../../src/methods/err.js';
import { inspect } from '../../../src/methods/inspect.js';
import { inspectErr } from '../../../src/methods/inspectErr.js';
import { ok } from '../../../src/methods/ok.js';
import { tap } from '../../../src/methods/tap.js';
import { tapErr } from '../../../src/methods/tapErr.js';
import { transpose } from '../../../src/methods/transpose.js';

describe('methods/inspect', () => {
  it('runs effect only for Ok and returns the same reference', () => {
    const onValue = vi.fn();
    const okValue = { ok: true as const, value: 5 };
    const errValue = { ok: false as const, error: 'boom' };

    expect(inspect(okValue, onValue)).toBe(okValue);
    expect(inspect(errValue, onValue)).toBe(errValue);
    expect(onValue).toHaveBeenCalledTimes(1);
    expect(onValue).toHaveBeenCalledWith(5);
  });
});

describe('methods/inspectErr', () => {
  it('runs effect only for Err and returns the same reference', () => {
    const onError = vi.fn();
    const okValue = { ok: true as const, value: 5 };
    const errValue = { ok: false as const, error: 'boom' };

    expect(inspectErr(okValue, onError)).toBe(okValue);
    expect(inspectErr(errValue, onError)).toBe(errValue);
    expect(onError).toHaveBeenCalledTimes(1);
    expect(onError).toHaveBeenCalledWith('boom');
  });
});

describe('methods/tap', () => {
  it('runs callback only for Ok', () => {
    const callback = vi.fn();
    tap({ ok: true, value: 1 }, callback);
    tap({ ok: false, error: 'x' }, callback);
    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith(1);
  });
});

describe('methods/tapErr', () => {
  it('runs callback only for Err', () => {
    const callback = vi.fn();
    tapErr({ ok: true, value: 1 }, callback);
    tapErr({ ok: false, error: 'x' }, callback);
    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith('x');
  });
});

describe('methods/ok', () => {
  it('converts Ok to Some and Err to None', () => {
    expect(ok({ ok: true, value: 3 })).toEqual({ some: true, value: 3 });
    expect(ok({ ok: false, error: 'x' })).toEqual({ some: false });
  });
});

describe('methods/err', () => {
  it('converts Err to Some and Ok to None', () => {
    expect(err({ ok: false, error: 'x' })).toEqual({ some: true, value: 'x' });
    expect(err({ ok: true, value: 3 })).toEqual({ some: false });
  });
});

describe('methods/transpose', () => {
  it('transposes Ok(Some) into Some(Ok)', () => {
    expect(transpose({ ok: true, value: { some: true, value: 9 } })).toEqual({
      some: true,
      value: { ok: true, value: 9 },
    });
  });

  it('transposes Ok(None) into None', () => {
    expect(transpose({ ok: true, value: { some: false } })).toEqual({
      some: false,
    });
  });

  it('transposes Err into Some(Err)', () => {
    expect(transpose({ ok: false, error: 'boom' })).toEqual({
      some: true,
      value: { ok: false, error: 'boom' },
    });
  });
});
