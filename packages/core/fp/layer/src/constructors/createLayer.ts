// @resultsafe/core-fp-layer/src/constructors/Layer.ts

import type { Layer } from '@resultsafe/core-fp-layer';

export const createLayer = <RIn, ROut>(
  fn: (context: RIn) => Promise<ROut>,
): Layer<RIn, ROut> => fn;


