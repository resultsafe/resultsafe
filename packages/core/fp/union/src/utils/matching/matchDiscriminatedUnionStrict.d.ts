import type { DiscriminatedUnion } from '../../types/variant/index.js';
export declare const matchDiscriminatedUnionStrict: <T extends DiscriminatedUnion, TMap extends { [K in T["type"]]: (value: Extract<T, {
    type: K;
}>) => any; }>(value: T, cases: TMap & { [K in T["type"]]: (value: Extract<T, {
    type: K;
}>) => any; }) => ReturnType<TMap[T["type"]]>;
//# sourceMappingURL=matchDiscriminatedUnionStrict.d.ts.map