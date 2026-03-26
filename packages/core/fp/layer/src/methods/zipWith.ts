// @resultsafe/core-fp-layer/src/methods/zipWith.ts

import type { Layer } from '@resultsafe/core-fp-layer';

export const zipWith =
  <RIn, ROut1, ROut2, RNew>(
    layer1: Layer<RIn, ROut1>,
    layer2: Layer<RIn, ROut2>,
    fn: (context1: ROut1, context2: ROut2) => RNew,
  ): Layer<RIn, RNew> =>
  async (context: RIn) => {
    const [result1, result2] = await Promise.all([
      layer1(context),
      layer2(context),
    ]);
    return fn(result1, result2);
  };


