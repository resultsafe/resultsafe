import { matchDiscriminatedUnionStrict } from '@resultsafe/core-fp-union';
import { describe, expect, it } from 'vitest';

// === ТИПЫ ===

interface OkResult<T> {
  readonly type: 'ok';
  readonly value: T;
}

interface ErrResult<E> {
  readonly type: 'err';
  readonly error: E;
}

type Result<T, E> = OkResult<T> | ErrResult<E>;

interface LoginAction {
  readonly type: 'login';
  readonly userId: number;
  readonly metadata: {
    readonly timestamp: string;
  };
}

interface LogoutAction {
  readonly type: 'logout';
  readonly reason?: string;
}

interface UpdateAction {
  readonly type: 'update';
  readonly fields: string[];
}

type UserAction = LoginAction | LogoutAction | UpdateAction;

interface IdleStatus {
  readonly type: 'idle';
}

interface LoadingStatus {
  readonly type: 'loading';
  readonly progress: number;
}

interface SuccessStatus {
  readonly type: 'success';
  readonly data: unknown;
}

interface FailureStatus {
  readonly type: 'failure';
  readonly message: string;
}

type Status = IdleStatus | LoadingStatus | SuccessStatus | FailureStatus;

// === ТЕСТЫ ===

describe('matchDiscriminatedUnionStrict', () => {
  it('✅ correctly matches Result<T, E> variants', () => {
    const okResult: Result<number, string> = { type: 'ok', value: 42 };
    const errResult: Result<number, string> = {
      type: 'err',
      error: 'Something went wrong',
    };

    const result1 = matchDiscriminatedUnionStrict(okResult, {
      ok: (r: OkResult<number>) => `Success: ${r.value}`,
      err: (r: ErrResult<string>) => `Error: ${r.error}`,
    });

    const result2 = matchDiscriminatedUnionStrict(errResult, {
      ok: (r: OkResult<number>) => `Success: ${r.value}`,
      err: (r: ErrResult<string>) => `Error: ${r.error}`,
    });

    expect(result1).toBe('Success: 42');
    expect(result2).toBe('Error: Something went wrong');
  });

  it('✅ provides type-safe access to variant properties', () => {
    const action: UserAction = {
      type: 'login',
      userId: 123,
      metadata: { timestamp: '2024-01-01' },
    };

    const result = matchDiscriminatedUnionStrict(action, {
      login: (a: LoginAction) =>
        `User ${a.userId} logged in at ${a.metadata.timestamp}`,
      logout: (a: LogoutAction) =>
        a.reason ? `Logout: ${a.reason}` : 'Logout',
      update: (a: UpdateAction) => `Updated ${a.fields.length} fields`,
    });

    expect(result).toBe('User 123 logged in at 2024-01-01');
  });

  it('✅ handles different return types per variant', () => {
    const status: Status = { type: 'loading', progress: 50 };

    const result = matchDiscriminatedUnionStrict(status, {
      idle: (): number => 0,
      loading: (s: LoadingStatus): number => s.progress,
      success: (s: SuccessStatus): unknown => s.data,
      failure: (s: FailureStatus): Error => new Error(s.message),
    });

    expect(result).toBe(50);
  });

  it('✅ handles all Status variants', () => {
    const statusList: Status[] = [
      { type: 'idle' },
      { type: 'loading', progress: 75 },
      { type: 'success', data: { id: 1 } }, // 🔥 было `{ type: 'success', { id: 1 } }`
      { type: 'failure', message: 'Network error' },
    ];

    const results = statusList.map((status) =>
      matchDiscriminatedUnionStrict(status, {
        idle: (): string => 'Idle state',
        loading: (s: LoadingStatus): string => `Loading: ${s.progress}%`,
        success: (s: SuccessStatus): string =>
          `Success: ${JSON.stringify(s.data)}`,
        failure: (s: FailureStatus): string => `Failure: ${s.message}`,
      }),
    );

    expect(results).toEqual([
      'Idle state',
      'Loading: 75%',
      'Success: {"id":1}',
      'Failure: Network error',
    ]);
  });
});


