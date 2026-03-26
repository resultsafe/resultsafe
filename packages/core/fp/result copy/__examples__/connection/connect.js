import { Ok, andThen } from '../../src/index.js';

const initial = Ok({ connectionId: 'conn-1', connected: false });

const connected = andThen(initial, (value) =>
  Ok({ ...value, connected: true }),
);

console.log('connect:', connected);
