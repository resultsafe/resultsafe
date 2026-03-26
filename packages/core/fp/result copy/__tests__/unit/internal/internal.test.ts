import { describe, expect, it } from 'vitest';

import { hasOwn, isObject } from '../../../src/internal/object.js';
import { None, Some } from '../../../src/internal/option.js';

describe('internal/object', () => {
  it('isObject accepts plain objects and rejects null/primitives', () => {
    expect(isObject({})).toBe(true);
    expect(isObject(null)).toBe(false);
    expect(isObject('x')).toBe(false);
  });

  it('hasOwn checks own properties only', () => {
    const value = Object.create({ inherited: 1 }) as Record<string, unknown>;
    value['own'] = 2;

    expect(hasOwn(value, 'own')).toBe(true);
    expect(hasOwn(value, 'inherited')).toBe(false);
  });
});

describe('internal/option', () => {
  it('Some wraps a value', () => {
    expect(Some(42)).toEqual({ some: true, value: 42 });
  });

  it('None is the canonical empty option', () => {
    expect(None).toEqual({ some: false });
  });
});
