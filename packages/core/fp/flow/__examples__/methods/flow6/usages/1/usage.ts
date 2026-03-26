import {
  flow,
  flow2,
  flow3,
  flow4,
  flow5,
  flow6,
} from '@resultsafe/core-fp-flow';

const add = (x: number) => (y: number) => x + y;
const multiply = (x: number) => (y: number) => x * y;
const toString = (x: number) => x.toString();
const toUpperCase = (x: string) => x.toUpperCase();
const length = (x: string) => x.length;

const flow1 = flow(add(2)); // (y: number) => number
const flow2Fn = flow2(add(2), multiply(3)); // (y: number) => number
const flow3Fn = flow3(add(2), multiply(3), toString); // (y: number) => string
const flow4Fn = flow4(add(2), multiply(3), toString, toUpperCase); // (y: number) => string
const flow5Fn = flow5(add(2), multiply(3), toString, toUpperCase, length); // (y: number) => number
const flow6Fn = flow6(
  add(2),
  multiply(3),
  toString,
  toUpperCase,
  length,
  multiply(2),
); // (y: number) => number

const result1 = flow1(5); // 7
const result2 = flow2Fn(5); // 21
const result3 = flow3Fn(5); // '21'
const result4 = flow4Fn(5); // '21'
const result5 = flow5Fn(5); // 2
const result6 = flow6Fn(5); // 4

console.log(result1); // 7
console.log(result2); // 21
console.log(result3); // '21'
console.log(result4); // '21'
console.log(result5); // 2
console.log(result6); // 4


