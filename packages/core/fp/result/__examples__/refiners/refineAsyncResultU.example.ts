import { refineAsyncResultU } from '@resultsafe/core-fp-result';

const variantMap = {
  created: { payload: ['id', 'meta'] },
  failed: { payload: 'reason' },
} as const;

async function main(): Promise<void> {
  const refined = await refineAsyncResultU(
    { type: 'created', id: '42', meta: 1 },
    'created',
    variantMap,
    {
      id: async (value: unknown) => typeof value === 'string',
      meta: async (value: unknown) => typeof value === 'number',
    },
  );

  console.log(refined);
}

await main();


