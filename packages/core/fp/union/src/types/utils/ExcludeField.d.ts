export type ExcludeField<TForbidden extends string | undefined> = TForbidden extends string ? {
    [K in TForbidden]?: never;
} : {};
//# sourceMappingURL=ExcludeField.d.ts.map