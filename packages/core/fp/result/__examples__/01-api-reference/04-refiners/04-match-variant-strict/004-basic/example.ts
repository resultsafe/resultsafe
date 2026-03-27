import { matchVariantStrict } from '@resultsafe/core-fp-result';

type Event =
  | { type: 'created'; id: string }
  | { type: 'failed'; reason: string };

const event: Event = { type: 'failed', reason: 'timeout' };

const output = matchVariantStrict<Event>(event)
  .with('created', (value) => `created:${value.id}`)
  .with('failed', (value) => `failed:${value.reason}`)
  .run();

console.log(output);


