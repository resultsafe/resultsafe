// @resultsafe/core-fp-layer/src/types/Layer.ts

export type Layer<RIn, ROut> = (context: RIn) => Promise<ROut>;


