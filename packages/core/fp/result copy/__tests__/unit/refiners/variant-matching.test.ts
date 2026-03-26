import { describe, expect, it, vi } from 'vitest';

import { isTypedVariant } from '../../../src/refiners/isTypedVariant.js';
import { isTypedVariantOf } from '../../../src/refiners/isTypedVariantOf.js';
import { matchVariant } from '../../../src/refiners/matchVariant.js';
import { matchVariantStrict } from '../../../src/refiners/matchVariantStrict.js';

type Event =
  | { type: 'created'; id: string }
  | { type: 'failed'; reason: string };

describe('refiners/isTypedVariant', () => {
  it('accepts objects with matching type and rejects others', () => {
    const isCreated = isTypedVariant('created');

    expect(isCreated({ type: 'created', id: '1' })).toBe(true);
    expect(isCreated({ type: 'failed', reason: 'x' })).toBe(false);
    expect(isCreated({})).toBe(false);
    expect(isCreated(null)).toBe(false);
    expect(isCreated('created')).toBe(false);
  });
});

describe('refiners/isTypedVariantOf', () => {
  it('matches by type and returns false for non-objects', () => {
    const isCreated = isTypedVariantOf<'created', { id: string }>('created');

    expect(isCreated({ type: 'created', id: '1' })).toBe(true);
    expect(isCreated({})).toBe(false);
    expect(isCreated({ type: 'failed', id: '1' })).toBe(false);
    expect(isCreated(undefined)).toBe(false);
  });

  it('checks required keys when Object.keys is mocked to include payload fields', () => {
    const keysSpy = vi.spyOn(Object, 'keys').mockReturnValue(['id']);
    const isCreated = isTypedVariantOf<'created', { id: string }>('created');

    expect(isCreated({ type: 'created' })).toBe(false);
    expect(isCreated({ type: 'created', id: '1' })).toBe(true);

    keysSpy.mockRestore();
  });
});

describe('refiners/matchVariant', () => {
  it('runs matching handler and returns fallback for unknown path', () => {
    const created: Event = { type: 'created', id: '1' };
    const failed: Event = { type: 'failed', reason: 'boom' };

    const createdResult = matchVariant<Event>(created)
      .with('created', (v) => `ok:${v.id}`)
      .otherwise(() => 'fallback')
      .run();

    const fallbackResult = matchVariant<Event>(failed)
      .with('created', (v) => `ok:${v.id}`)
      .otherwise((v) => `fallback:${v.type}`)
      .run();

    expect(createdResult).toBe('ok:1');
    expect(fallbackResult).toBe('fallback:failed');
  });

  it('supports chained handlers and no-handler fallback path', () => {
    const failed: Event = { type: 'failed', reason: 'boom' };

    const chainedResult = matchVariant<Event>(failed)
      .with('created', (v) => `ok:${v.id}`)
      .with('failed', (v) => `err:${v.reason}`)
      .otherwise(() => 'fallback')
      .run();

    const noHandlerResult = matchVariant<Event>(failed)
      .otherwise((v) => `only-fallback:${v.type}`)
      .run();

    expect(chainedResult).toBe('err:boom');
    expect(noHandlerResult).toBe('only-fallback:failed');
  });

  it('uses nested fallback when chained handlers do not match', () => {
    const failed: Event = { type: 'failed', reason: 'boom' };

    const result = matchVariant<Event>(failed)
      .with('created', (v) => `ok:${v.id}`)
      .with('created', (v) => `ok2:${v.id}`)
      .otherwise(() => 'nested-fallback')
      .run();

    expect(result).toBe('nested-fallback');
  });
});

describe('refiners/matchVariantStrict', () => {
  it('runs matching strict handler', () => {
    const value: Event = { type: 'created', id: '1' };
    const result = matchVariantStrict(value)
      .with('created', (v) => `ok:${v.id}`)
      .run();

    expect(result).toBe('ok:1');
  });

  it('throws when no handler matches', () => {
    const value: Event = { type: 'failed', reason: 'boom' };

    expect(() =>
      matchVariantStrict<Event>(value)
        .with('created', (v) => `ok:${v.id}`)
        .run(),
    ).toThrowError('Unmatched variant: failed');
  });

  it('throws from root run when no handlers were registered', () => {
    const value: Event = { type: 'failed', reason: 'boom' };
    const strict = matchVariantStrict(value) as unknown as {
      run: () => unknown;
    };

    expect(() => strict.run()).toThrowError('Unmatched variant: failed');
  });
});
