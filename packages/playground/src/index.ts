import {
  Err,
  Ok,
  andThen,
  map,
  mapErr,
  match,
  unwrapOr,
} from "@resultsafe/core-fp-result";

type ParseError = "EMPTY_INPUT" | "NOT_A_NUMBER";
type ValidationError = "NOT_POSITIVE";
type AppError = ParseError | ValidationError;

const parseNumber = (input: string) => {
  if (input.trim() === "") return Err<ParseError>("EMPTY_INPUT");
  const value = Number(input);
  return Number.isFinite(value) ? Ok(value) : Err<ParseError>("NOT_A_NUMBER");
};

const requirePositive = (value: number) => {
  return value > 0 ? Ok(value) : Err<ValidationError>("NOT_POSITIVE");
};

const successFlow = andThen(parseNumber("21"), requirePositive);
const doubledSuccess = map(successFlow, (value) => value * 2);
const successValue = unwrapOr(doubledSuccess, 0);

const failedFlow = andThen(parseNumber("-7"), requirePositive);
const normalizedFailure = mapErr(failedFlow, (error: AppError) => `ERROR:${error}`);

const successText = match(
  doubledSuccess,
  (value) => `OK => ${value}`,
  (error) => `ERR => ${String(error)}`,
);
const failureText = match(
  normalizedFailure,
  (value) => `OK => ${value}`,
  (error) => `ERR => ${error}`,
);

console.log("Success value:", successValue);
console.log("Success match:", successText);
console.log("Failure match:", failureText);
