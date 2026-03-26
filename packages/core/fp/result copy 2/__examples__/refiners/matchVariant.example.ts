import { matchVariant } from '@resultsafe/core-fp-result';

type Event =
  | { type: 'created'; id: string }
  | { type: 'failed'; reason: string };

const event: Event = { type: 'created', id: '42' };

const output = matchVariant<Event>(event)
  .with('created', (value) => `created:${value.id}`)
  .with('failed', (value) => `failed:${value.reason}`)
  .otherwise(() => 'fallback')
  .run();

console.log(output);


