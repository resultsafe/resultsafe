import { Err, Ok, orElse } from '../../src/index.js';

const disconnected = Err({ reason: 'timeout' });

const retried = orElse(disconnected, () =>
  Ok({ connectionId: 'conn-1', connected: true, reconnected: true }),
);

console.log('reconnect:', retried);
