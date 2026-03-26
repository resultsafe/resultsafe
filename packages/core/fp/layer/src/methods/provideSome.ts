// @resultsafe/core-fp-layer/src/methods/provideSome.ts

import type { Layer } from '@resultsafe/core-fp-layer';

export const provideSome =
  <RIn, ROut>(
    layer: Layer<RIn & ROut, ROut>,
    context: RIn,
  ): Layer<ROut, ROut> =>
  (remainingContext: ROut) =>
    layer({ ...context, ...remainingContext });


