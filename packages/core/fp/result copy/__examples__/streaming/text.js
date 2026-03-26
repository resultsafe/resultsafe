import { Ok, match } from '../../src/index.js';

const chunk = Ok('stream-chunk-1');

const rendered = match(
  chunk,
  (value) => `stream text: ${value}`,
  (error) => `stream error: ${String(error)}`,
);

console.log(rendered);
