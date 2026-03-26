export type Result<T, E> =
  | { readonly ok: true; readonly value: T }
  | { readonly ok: false; readonly error: E };

export type Option<T> =
  | { readonly some: true; readonly value: T }
  | { readonly some: false };

export interface VariantConfig {
  readonly payload: 'never' | string | readonly string[];
  readonly forbidden?: string | undefined;
  readonly strictFields?: boolean | undefined;
}

export type PayloadKeys<T extends VariantConfig> = T['payload'] extends 'never'
  ? never
  : T['payload'] extends string
    ? T['payload']
    : T['payload'] extends readonly string[]
      ? T['payload'][number]
      : never;

export type ValidatorFn<T = unknown> = (x: unknown) => x is T;

export type AsyncValidatorFn = (value: unknown) => Promise<boolean>;
