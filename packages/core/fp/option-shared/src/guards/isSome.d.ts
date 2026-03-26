import type { Option } from '../types/Option.js';
export declare const isSome: <T>(option: Option<T>) => option is {
    readonly some: true;
    readonly value: T;
};
//# sourceMappingURL=isSome.d.ts.map