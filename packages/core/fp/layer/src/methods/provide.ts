// @resultsafe/core-fp-layer/src/methods/provide.ts

import type { Layer } from '@resultsafe/core-fp-layer';

export const provide = <RIn, ROut>(
  layer: Layer<RIn, ROut>,
  context: RIn,
): Promise<ROut> => layer(context);


