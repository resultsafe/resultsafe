import { Err, isErrAnd } from '@resultsafe/core-fp-result';

const result = Err({ code: 503, message: 'Service unavailable' });

const isRetryable = isErrAnd(
  result,
  (error) => error.code >= 500,
);

console.log('retryable:', isRetryable);


