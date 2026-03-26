// @resultsafe/core-fp-layer/src/methods/zip.ts

import type { Layer } from '@resultsafe/core-fp-layer';

export const zip =
  <RIn, ROut1, ROut2>(
    layer1: Layer<RIn, ROut1>,
    layer2: Layer<RIn, ROut2>,
  ): Layer<RIn, ROut1 & ROut2> =>
  async (context: RIn) => {
    const [result1, result2] = await Promise.all([
      layer1(context),
      layer2(context),
    ]);
    return { ...result1, ...result2 };
  };


