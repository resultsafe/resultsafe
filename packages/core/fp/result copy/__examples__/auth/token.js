import { Ok, map } from '../../src/index.js';

const tokenResult = Ok('api-token-123');
const authHeader = map(tokenResult, (token) => `Bearer ${token}`);

console.log('auth token:', authHeader);
