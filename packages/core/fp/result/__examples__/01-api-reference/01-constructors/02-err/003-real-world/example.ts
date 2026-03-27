/**
 * @module 003-real-world
 * @title Err in Real-World Scenarios
 * @description Using Err in production code for API errors, validation failures, and error propagation.
 * @example
 * import { Err, Ok } from '@resultsafe/core-fp-result';
 * interface ApiError { status: number; message: string; }
 * const fetchUser = async (id: string) => {
 *   const response = await fetch('/api/users/' + id);
 *   if (!response.ok) return Err({ status: response.status, message: response.statusText });
 *   return Ok(await response.json());
 * };
 * @tags result,err,real-world,api,production
 * @since 0.1.0
 * @difficulty Advanced
 * @time 15min
 * @category constructors
 * @see {@link 001-basic-usage} @see {@link 002-with-custom-error}
 * @ai {"purpose":"Teach production Err usage patterns","prerequisites":["Err constructor","async/await"],"objectives":["API errors","Error propagation"],"rag":{"queries":["Err real-world example","API error handling Result"],"intents":["practical","production"],"expectedAnswer":"Use Err for API errors with structured types","confidence":0.95},"embedding":{"semanticKeywords":["err","api","error","fetch","production"],"conceptualTags":["error-handling","production","api-client"],"useCases":["api-error","http-error","fetch"]},"codeSearch":{"patterns":["Err({status,message})","return Err(error)","Promise<Err<T,E>>"],"imports":["import { Err, Ok } from '@resultsafe/core-fp-result'"]},"learningPath":{"progression":["04-error-handling/001-error-recovery"]},"chunking":{"type":"self-contained","section":"constructors","subsection":"err","tokenCount":350,"relatedChunks":["001-basic-usage","002-with-custom-error"]}}
 */

import { Err, Ok } from '@resultsafe/core-fp-result';

interface User {
  id: string;
  name: string;
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

if (require.main === module) {
  fetchUser('user-1').then(console.log);
}
