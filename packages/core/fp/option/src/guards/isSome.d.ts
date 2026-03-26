import type { Option } from '@resultsafe/core-fp-option-shared';
export declare const isSome: <T>(option: Option<T>) => option is {
    readonly some: true;
    readonly value: T;
};
//# sourceMappingURL=isSome.d.ts.map

