/**
 * @module 002-with-generics
 * @title Ok with Explicit Generics
 * @description Using Ok with explicit generic type parameters for better type safety. This example shows how to specify success and error types explicitly.
 * @example
 * // With explicit type parameters
 * import { Ok } from '@resultsafe/core-fp-result';
 *
 * const result = Ok<number, string>(42);
 * console.log(result); // { ok: true, value: 42 }
 * @tags result,ok,generics,typescript,intermediate
 * @since 0.1.0
 *
 * @difficulty Intermediate
 * @time 5min
 * @category constructors
 * @see {@link 001-basic-usage} - Basic usage @see {@link 003-real-world} - Real-world scenarios
 * @ai {"purpose":"Teach explicit generic usage with Ok","prerequisites":["Ok constructor","TypeScript generics"],"objectives":["Explicit type parameters","Type inference"],"rag":{"queries":["Ok with generics","explicit type Ok"],"intents":["learning","reference"],"expectedAnswer":"Use Ok<T,E>(value) for explicit types","confidence":0.95},"embedding":{"semanticKeywords":["generics","typescript","types","parameters"],"conceptualTags":["type-safety","generics","inference"],"useCases":["api-response","validation"]},"codeSearch":{"patterns":["Ok<T,E>(value)","Ok<number,string>(42)"],"imports":["import { Ok } from '@resultsafe/core-fp-result'"]},"learningPath":{"progression":["003-real-world"]},"chunking":{"type":"self-contained","section":"constructors","subsection":"ok","tokenCount":250,"relatedChunks":["003-real-world"]}}
 */

import { Ok } from '@resultsafe/core-fp-result';

// ===== Example 1: Explicit type parameters =====
const explicitTypes = () => {
  const numberResult = Ok<number, string>(42);
  console.log(numberResult); // { ok: true, value: 42 }

  const stringResult = Ok<string, Error>('success');
  console.log(stringResult); // { ok: true, value: 'success' }
};

// ===== Example 2: Complex types =====
interface User {
  id: string;
  name: string;
}

type ApiError = { code: number; message: string };

const complexTypes = () => {
  const userResult = Ok<User, ApiError>({
    id: 'user-1',
    name: 'John',
  });

  console.log(userResult.value.name); // 'John'
};

// ===== Run if standalone =====
if (require.main === module) {
  explicitTypes();
  complexTypes();
}
