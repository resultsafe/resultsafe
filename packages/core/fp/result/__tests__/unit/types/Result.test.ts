import type { Result } from '@resultsafe/core-fp-result-shared';
import { describe, expect, it } from 'vitest';

describe('types/Result', () => {
  it('supports Ok branch narrowing', () => {
    const value: Result<number, string> = { ok: true, value: 7 };

    if (value.ok) {
      expect(value.value).toBe(7);
    } else {
      throw new Error('Expected Ok branch');
    }
  });

  it('supports Err branch narrowing', () => {
    const value: Result<number, string> = { ok: false, error: 'boom' };

    if (!value.ok) {
      expect(value.error).toBe('boom');
    } else {
      throw new Error('Expected Err branch');
    }
  });
});


