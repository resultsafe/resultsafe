import { Err, unwrapOrElse } from '../../src/index.js';

const failure = Err({ code: 'E_RETRY', attempts: 3 });
const message = unwrapOrElse(
  failure,
  (error) => `retry required (${error.code}, attempts=${error.attempts})`,
);

console.log(message);
