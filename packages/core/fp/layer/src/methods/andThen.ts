// @resultsafe/core-fp-layer/src/methods/andThen.ts

import type { Layer } from '@resultsafe/core-fp-layer';

export const andThen =
  <RIn, ROut, RNew>(
    layer: Layer<RIn, ROut>,
    fn: (context: ROut) => Layer<ROut, RNew>,
  ): Layer<RIn, RNew> =>
  async (context: RIn) => {
    const intermediate = await layer(context);
    const nextLayer = fn(intermediate);
    return nextLayer(intermediate);
  };


