// docs/__examples__/methods/andThen.v01.example.ts
import { andThen, None, Some } from '@resultsafe/core-fp-option';
import { type Option, isSome } from '@resultsafe/core-fp-option-shared';

/**
 * 🔗 Demonstrates how to safely chain Option computations using `andThen`.
 *
 * @remarks
 * - Covers all possible cases: Some → Some, Some → None, None propagation
 * - Shows real-world usage with numbers, objects, arrays, nested Options, and API-like responses
 *
 * @example
 * ```ts
 * import { andThen, some, none, isSome } from '@resultsafe/core-fp-option';
 *
 * const option = some(5);
 * const result = andThen(option, x => some(x * 2));
 * if (isSome(result)) {
 *   console.log(result.value); // 10
 * }
 * ```
 */
export const andThen_v01_example_en = (): void => {
  // ---------------------
  // 🧪 Simple chaining: Some → Some
  // ---------------------
  const option1: Option<number> = Some(5);
  const result1 = andThen(option1, (x: number) => Some(x * 2));

  if (isSome(result1) && result1.some === true) {
    console.log('🧪 Result1 value:', result1.value); // 10
  }

  // ---------------------
  // ❌ Some → None
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
  if (isSome(result4) && result4.some === true) {
    console.log('🔄 User name uppercased:', result4.value.name);
  }

  const option5: Option<number[]> = Some([1, 2, 3]);
  const result5 = andThen(option5, (arr: number[]) =>
    Some(arr.map((x) => x * 10)),
  );
  if (isSome(result5) && result5.some === true) {
    console.log('🔄 Mapped array:', result5.value);
  }

  // ---------------------
  // 🧪 Nested Option
  // ---------------------
  const nested: Option<Option<string>> = Some(Some('nested'));
  const nestedResult: Option<string> = andThen(
    nested,
    (inner: Option<string>) => inner,
  );
  if (isSome(nestedResult) && nestedResult.some === true) {
    console.log('🧪 Nested value:', nestedResult.value);
  }

  // ---------------------
  // ⚡ Real-world scenario: API-like transformation
  // ---------------------
  type ApiResponse = { success: boolean; data: number[] };

  const fetchOption: Option<ApiResponse> = Some({
    success: true,
    data: [1, 2, 3],
  });
  const transformed = andThen(fetchOption, (res: ApiResponse) =>
    res.success ? Some(res.data.map((x) => x * 2)) : None,
  );
  if (isSome(transformed) && transformed.some === true) {
    console.log('⚡ Transformed API data:', transformed.value);
  }
};

/**
 * ✅ Execute example to verify types and runtime behavior
 */
andThen_v01_example_en();


