/**
 * @module 003-real-world
 * @title Ok in Real-World Scenarios
 * @description Using Ok in production code with API responses, validation, and error handling. This example demonstrates practical usage patterns.
 * @example
 * // API response pattern
 * import { Ok, Err } from '@resultsafe/core-fp-result';
 *
 * interface User { id: string; name: string; }
 * type ApiError = { status: number; message: string };
 *
 * const fetchUser = async (id: string): Promise<Ok<User, ApiError>> => {
 *   const response = await fetch(`/api/users/${id}`);
 *   if (!response.ok) {
 *     return Err({ status: response.status, message: response.statusText });
 *   }
 *   return Ok(await response.json());
 * };
 * @tags result,ok,real-world,api,production
 * @since 0.1.0
 *
 * @difficulty Advanced
 * @time 15min
 * @category constructors
 * @see {@link Err} - Error constructor @see {@link match} - Pattern matching
 * @ai {"purpose":"Teach production Ok usage patterns","prerequisites":["Ok constructor","async/await","API patterns"],"objectives":["API responses","Error handling","Type safety"],"rag":{"queries":["Ok real-world example","Result API client TypeScript"],"intents":["practical","production"],"expectedAnswer":"Use Ok for successful API responses with typed errors","confidence":0.95},"embedding":{"semanticKeywords":["api","production","fetch","response","async"],"conceptualTags":["error-handling","type-safety","production"],"useCases":["api-client","http-request","fetch"]},"codeSearch":{"patterns":["Ok<User,ApiError>","return Ok(data)","Promise<Ok<T,E>>"],"imports":["import { Ok, Err } from '@resultsafe/core-fp-result'"]},"learningPath":{"progression":["04-error-handling/001-error-recovery"]},"chunking":{"type":"self-contained","section":"constructors","subsection":"ok","tokenCount":400,"relatedChunks":["001-basic-usage","002-with-generics"]}}
 */

import { Err, Ok } from '@resultsafe/core-fp-result';

// ===== Example 1: API Response Pattern =====
interface User {
  id: string;
  name: string;
  email: string;
}

interface ApiError {
  status: number;
  message: string;
}

type UserResult = Ok<User, ApiError> | Err<ApiError>;

const fetchUser = async (id: string): Promise<UserResult> => {
  try {
    const response = await fetch(`/api/users/${id}`);

    if (!response.ok) {
      return Err({
        status: response.status,
        message: response.statusText,
      });
    }

    const data = await response.json();
    return Ok(data);
  } catch (error) {
    return Err({
      status: 0,
      message: error instanceof Error ? error.message : 'Network error',
    });
  }
};

// ===== Example 2: Validation Pattern =====
interface ValidationError {
  field: string;
  message: string;
}

const validateEmail = (
  email: string,
): Ok<string, ValidationError> | Err<ValidationError> => {
  if (!email.includes('@')) {
    return Err({ field: 'email', message: 'Invalid email format' });
  }
  return Ok(email);
};

// ===== Example 3: Factory Function =====
const createUser = (name: string, email: string) => {
  const emailResult = validateEmail(email);

  if (emailResult.ok === false) {
    return emailResult;
  }

  return Ok({ id: 'user-1', name, email: emailResult.value });
};

// ===== Run if standalone =====
if (require.main === module) {
  const user = createUser('John', 'john@example.com');
  console.log(user); // Ok({ id: 'user-1', name: 'John', email: 'john@example.com' })
}
