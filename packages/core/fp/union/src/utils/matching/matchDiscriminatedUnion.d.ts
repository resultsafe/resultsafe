import type { DiscriminatedUnion } from '../../types/variant/index.js';
export declare const matchDiscriminatedUnion: <T extends DiscriminatedUnion, R, TMap extends Record<string, (value: T) => R>>(value: T, cases: TMap) => R;
//# sourceMappingURL=matchDiscriminatedUnion.d.ts.map