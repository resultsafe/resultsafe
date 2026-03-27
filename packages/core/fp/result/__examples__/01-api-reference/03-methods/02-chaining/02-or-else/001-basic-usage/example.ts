/**
 * @module 001-basic-usage
 * @title orElse - Fallback for Error Values
 * @description Learn to use orElse to provide a fallback Result when the current Result is Err. Enables recovery and alternative value chains.
 * @example
 * import { Err, Ok, orElse } from '@resultsafe/core-fp-result';
 * orElse(Err('network'), () => Ok('cached-value')); // Ok('cached-value')
 * @example
 * import { Ok, Err, orElse } from '@resultsafe/core-fp-result';
 * orElse(Ok(5), () => Ok(0)); // Ok(5)
 * orElse(Err('fail'), () => Ok(0)); // Ok(0)
 * @tags orElse,fallback,recovery,chaining,error-handling,intermediate
 * @since 0.1.0
 * @lastModified 2026-03-27T14:30:00Z
 * @difficulty Intermediate
 * @time 5min
 * @category methods
 * @see {@link andThen} @see {@link unwrapOr} @see {@link mapErr}
 * @ai {"purpose":"Teach orElse for fallback recovery","prerequisites":["Result type","Error handling"],"objectives":["orElse syntax","Fallback pattern"],"rag":{"queries":["how to use orElse on Result","orElse fallback example"],"intents":["learning","practical"],"expectedAnswer":"Use orElse(result, fn) to provide fallback for Err","confidence":0.95},"embedding":{"semanticKeywords":["orElse","fallback","recovery","chaining","error-handling"],"conceptualTags":["error-recovery","alternative"],"useCases":["cache-fallback","retry-logic"]},"codeSearch":{"patterns":["orElse(result, () => ...)","orElse(source, fallback)"],"imports":["import { orElse } from '@resultsafe/core-fp-result'"]},"learningPath":{"progression":["001-and-then","003-unwrap-or"]},"chunking":{"type":"self-contained","section":"methods","subsection":"chaining","tokenCount":270,"relatedChunks":["001-and-then","003-unwrap-or"]}}
 */

import { Err, Ok, orElse } from '@resultsafe/core-fp-result';

const fallback = orElse(Err('network'), () => Ok('cached-value'));

console.log(fallback);
