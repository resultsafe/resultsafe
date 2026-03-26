export type Result<T, E> = {
    readonly ok: true;
    readonly value: T;
} | {
    readonly ok: false;
    readonly error: E;
};
//# sourceMappingURL=Result.d.ts.map