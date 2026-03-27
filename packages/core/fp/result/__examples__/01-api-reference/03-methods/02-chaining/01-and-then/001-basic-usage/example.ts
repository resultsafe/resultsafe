import { Err, Ok, andThen } from '@resultsafe/core-fp-result';

const parsePort = (raw: string) => {
  const port = Number(raw);
  return Number.isInteger(port) ? Ok(port) : Err('invalid-port');
};

const value = andThen(Ok('8080'), parsePort);
console.log(value);


