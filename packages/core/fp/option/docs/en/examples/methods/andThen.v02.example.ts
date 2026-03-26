// __examples__/methods/andThen.v02.example.ts
import { andThen, None, Some } from '@resultsafe/core-fp-option';
import { type Option } from '@resultsafe/core-fp-option-shared';

/**
 * 🔗 [EN] Demonstrates safe chaining of Option computations using `andThen`.
 * 🔗 [RU] Демонстрирует безопасную цепочку вычислений с Option с помощью `andThen`.
 *
 * @remarks
 * - [EN] Covers all cases: Some → Some, Some → None, None propagation
 * - [RU] Покрывает все кейсы: Some → Some, Some → None, распространение None
 * - [EN] Works with numbers, strings, objects, arrays, nested Options, and API-like responses
 * - [RU] Примеры с числами, строками, объектами, массивами, вложенными Option и ответами API
 *
 * @example
 * ```ts
 * import { andThen, some, none } from '@resultsafe/core-fp-option';
 *
 * const result = andThen(some(5), x => some(x * 2));
 * if (result.some === true) console.log(result.value); // 10
 * ```
 */
export const exampleAndThen = (): void => {
  // ---------------------
  // 🧪 Basic usage: Some → Some
  // ---------------------
  const option1: Option<number> = Some(5);
  const result1 = andThen(option1, (x: number) => Some(x * 2));
  if (result1.some === true) {
    console.log('🧪 [EN] Result1 value:', result1.value); // 10
    console.log('🧪 [RU] Результат1 значение:', result1.value); // 10
  }

  // ---------------------
  // ❌ Basic usage: Some → None
  // ---------------------
  const option2: Option<number> = Some(0);
  const result2 = andThen(option2, (x: number) => (x > 0 ? Some(x * 2) : None));
  console.log('❌ Result2 is None:', result2.some === false);

  // ---------------------
  // ❌ None propagation
  // ---------------------
  const option3: Option<string> = None;
  const result3 = andThen(option3, (x: string) => Some(x.toUpperCase()));
  console.log('❌ Result3 is None:', result3.some === false);

  // ---------------------
  // 🔄 Complex types: objects, arrays
  // ---------------------
  type User = { id: number; name: string };

  const option4: Option<User> = Some({ id: 1, name: 'Alice' });
  const result4 = andThen(option4, (user: User) =>
    Some({ ...user, name: user.name.toUpperCase() }),
  );
  if (result4.some === true) {
    console.log('🔄 User name uppercased:', result4.value.name); // ALICE
  }

  const option5: Option<number[]> = Some([1, 2, 3]);
  const result5 = andThen(option5, (arr: number[]) =>
    Some(arr.map((x) => x * 10)),
  );
  if (result5.some === true) {
    console.log('🔄 Mapped array:', result5.value); // [10, 20, 30]
  }

  class UserClass {
    constructor(
      public readonly id: number,
      public readonly name: string,
    ) {}
  }
  const userOption: Option<UserClass> = Some(new UserClass(1, 'Bob'));
  const userResult = andThen(userOption, (user: UserClass) =>
    user.id > 0 ? Some({ ...user, isActive: true }) : None,
  );
  if (userResult.some === true) {
    console.log('🔄 Custom class result:', userResult.value);
  }

  // ---------------------
  // 📊 Type narrowing
  // ---------------------
  interface ApiSuccess {
    type: 'success';
    data: { id: number; name: string };
  }

  interface ApiCached {
    type: 'cached';
    data: { id: number; name: string };
    ttl: number;
  }

  interface ApiPartial {
    type: 'partial';
    data: { id: number };
    warnings: string[];
  }

  type ApiResponseType = ApiSuccess | ApiCached | ApiPartial;

  const optionApi: Option<ApiResponseType> = Some({
    type: 'success',
    data: { id: 1, name: 'Product A' },
  } as ApiSuccess);

  const apiResult = andThen(optionApi, (resp: ApiResponseType) =>
    resp.type === 'success' ? Some(resp.data) : None,
  );
  if (apiResult.some === true) {
    console.log('📊 API data:', apiResult.value);
  }

  // ---------------------
  // 🧪 Nested Option
  // ---------------------
  const nestedOption: Option<Option<string>> = Some(Some('Nested success'));
  const nestedResult = andThen(nestedOption, (inner: Option<string>) =>
    andThen(inner, (x) => Some(x.toUpperCase())),
  );
  if (nestedResult.some === true) {
    console.log('🧪 Nested Option value:', nestedResult.value); // NESTED SUCCESS
  }

  // ---------------------
  // ⚡ Async Option compatibility
  // ---------------------
  const asyncOption: Promise<Option<number>> = Promise.resolve(Some(100));
  (async () => {
    const optionAsync = await asyncOption;
    const asyncResult = andThen(optionAsync, (x: number) => Some(x * 2));
    if (asyncResult.some === true) {
      console.log('⚡ Async Option value:', asyncResult.value); // 200
    }
  })();
};

/** Execute example to verify types and runtime behavior */
exampleAndThen();


