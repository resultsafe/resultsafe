import type { DiscriminatedUnion } from '../../types/variant/DiscriminatedUnion.js';
export declare const refineDiscriminatedUnion: <T extends DiscriminatedUnion, R extends T = T>(value: T, predicate: (value: T) => value is R) => R | null;
//# sourceMappingURL=refineDiscriminatedUnion.d.ts.map