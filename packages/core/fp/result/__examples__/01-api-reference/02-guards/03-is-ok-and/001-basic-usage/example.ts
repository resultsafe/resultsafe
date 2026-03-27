/**
 * @module 001-basic-usage
 * @title isOkAnd Type Guard with Predicate
 * @description Learn to use isOkAnd to check if a Result is Ok and satisfies a predicate. Combines type narrowing with custom validation logic.
 * @example
 * import { Ok, isOkAnd } from '@resultsafe/core-fp-result';
 * const result = Ok({ active: true });
 * const isActive = isOkAnd(result, v => v.active);
 * @example
 * import { Ok, isOkAnd } from '@resultsafe/core-fp-result';
 * const result = Ok({ id: 'u-1', active: true });
 * console.log(isOkAnd(result, v => v.active && v.id.length > 0)); // true
 * @tags isOkAnd,guard,predicate,result,validation,intermediate
 * @since 0.1.0
 * @lastModified 2026-03-27T14:30:00Z
 * @difficulty Intermediate
 * @time 5min
 * @category guards
 * @see {@link isOk} @see {@link isErrAnd} @see {@link match}
 * @ai {"purpose":"Teach isOkAnd guard with predicate","prerequisites":["isOk guard","TypeScript predicates"],"objectives":["isOkAnd syntax","Predicate function"],"rag":{"queries":["how to use isOkAnd","isOkAnd predicate example"],"intents":["learning","practical"],"expectedAnswer":"Use isOkAnd(result, predicate) to check Ok and validate value","confidence":0.95},"embedding":{"semanticKeywords":["isOkAnd","guard","predicate","result","validation"],"conceptualTags":["type-narrowing","conditional-validation"],"useCases":["business-logic","data-validation"]},"codeSearch":{"patterns":["isOkAnd(result, (v) => ...)","isOkAnd(result, predicate)"],"imports":["import { isOkAnd } from '@resultsafe/core-fp-result'"]},"learningPath":{"progression":["001-is-ok","004-is-err-and"]},"chunking":{"type":"self-contained","section":"guards","subsection":"is-ok-and","tokenCount":280,"relatedChunks":["001-is-ok","004-is-err-and"]}}
 */

import { Ok, isOkAnd } from '@resultsafe/core-fp-result';

const result = Ok({ id: 'u-1', active: true });

const isActiveUser = isOkAnd(
  result,
  (value) => value.active === true && value.id.length > 0,
);

console.log('is active user:', isActiveUser);
