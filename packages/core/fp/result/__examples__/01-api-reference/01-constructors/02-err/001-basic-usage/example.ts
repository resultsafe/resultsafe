/**
 * @module 001-basic-usage
 * @title Creating Err Values
 * @description Creating error Result values with Err constructor. This example demonstrates how to explicitly represent failures without exceptions.
 * @example
 * // Basic usage - Create an error value
 * import { Err } from '@resultsafe/core-fp-result';
 *
 * const error = Err('Something went wrong');
 * console.log(error); // { ok: false, error: 'Something went wrong' }
 * console.log(error.ok); // false
 * console.log(error.error); // 'Something went wrong'
 * @tags result,err,constructor,basic,beginner
 * @since 0.1.0
 *
 * @difficulty Beginner
 * @time 5min
 * @category constructors
 * @see {@link Ok} - Create success result @see {@link match} - Pattern matching
 * @ai {"purpose":"Teach Err constructor usage","prerequisites":["TypeScript types"],"objectives":["Err syntax","Result error structure"],"rag":{"queries":["how to create Err result","Err constructor example"],"intents":["learning","practical"],"expectedAnswer":"Use Err(error) to create error result","confidence":0.95},"embedding":{"semanticKeywords":["result","err","constructor","error","failure"],"conceptualTags":["explicit-errors","type-safety","fp"],"useCases":["error-handling","validation","api-errors"]},"codeSearch":{"patterns":["Err(error)","Err<T,E>(error)","return Err(...)"],"imports":["import { Err } from '@resultsafe/core-fp-result'"]},"learningPath":{"progression":["002-with-custom-error","003-real-world"]},"chunking":{"type":"self-contained","section":"constructors","subsection":"err","tokenCount":280,"relatedChunks":["002-with-custom-error"]}}
 */

import { Err, Ok, type Result } from '@resultsafe/core-fp-result';

// ===== Example 1: Basic error value =====
const basicExample = () => {
  const error = Err('Something went wrong');
  console.log(error); // { ok: false, error: 'Something went wrong' }
  console.log(error.ok); // false
  if (error.ok === false) {
    console.log(error.error); // 'Something went wrong'
  }
};

// ===== Example 2: Error in function =====
const divide = (a: number, b: number): Result<number, string> => {
  if (b === 0) {
    return Err('Division by zero');
  }
  return Ok(a / b);
};

const functionExample = () => {
  const result = divide(10, 0);
  console.log(result); // { ok: false, error: 'Division by zero' }
};

// ===== Run if standalone =====
if (require.main === module) {
  basicExample();
  functionExample();
}
