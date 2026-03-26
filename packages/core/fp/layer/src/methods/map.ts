// @resultsafe/core-fp-layer/src/methods/map.ts

import type { Layer } from '@resultsafe/core-fp-layer';

export const map =
  <RIn, ROut, RNew>(
    layer: Layer<RIn, ROut>,
    fn: (context: ROut) => RNew,
  ): Layer<RIn, RNew> =>
  async (context: RIn) => {
    const result = await layer(context);
    return fn(result);
  };


