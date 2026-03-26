// example-createValidatedResult.ts

import {
  isValidatedResult,
  type VariantConfig,
} from '@resultsafe/core-fp-union';
// example-createValidatedResult.ts

// === 1. Определяем конфигурацию вариантов ===

/**
 * @description
 * [EN] Configuration for Result-like discriminated union<br/>
 * [RU] Конфигурация для Result-подобного дискриминантного объединения<br/>
 *
 * @example
 * ```ts
 * const resultConfig = {
 *   ok: { payload: 'value', forbidden: 'error', strictFields: true },
 *   err: { payload: 'error', forbidden: 'value', strictFields: true },
 * };
 * ```
 */
const resultConfig = {
  ok: {
    payload: 'value', // [EN] Required field: value<br/> [RU] Обязательное поле: value
    forbidden: 'error', // [EN] Forbidden field: error<br/> [RU] Запрещённое поле: error
    strictFields: true, // [EN] Strict field checking<br/> [RU] Строгая проверка полей
  },
  err: {
    payload: 'error',
    forbidden: 'value',
    strictFields: true,
  },
} satisfies Record<string, VariantConfig>;

// === 2. Создаём гвард с валидаторами ===

/**
 * @description
 * [EN] Type guard for API result with custom validators<br/>
 * [RU] Type guard для API-результата с пользовательскими валидаторами<br/>
 */
const isApiResult = isValidatedResult(resultConfig);

// === 3. Определяем пользовательские валидаторы ===

/**
 * @description
 * [EN] Custom validators for API result variants<br/>
 * [RU] Пользовательские валидаторы для вариантов API-результата<br/>
 */
const apiResultValidators = {
  ok: {
    // [EN] value must be a positive number<br/> [RU] value должно быть положительным числом
    value: (x: unknown): x is number => typeof x === 'number' && x > 0,
  },
  err: {
    // [EN] error must be a non-empty string<br/> [RU] error должно быть непустой строкой
    error: (x: unknown): x is string => typeof x === 'string' && x.length > 0,
  },
} as const;

// === 4. Тестируем с разными значениями ===

console.log('\n=== Тест 1: Корректный Ok ===');
const validOk = { type: 'ok', value: 42 } as unknown;

if (
  isApiResult(validOk, apiResultValidators) &&
  validOk !== undefined &&
  validOk.type === 'ok'
) {
  // ✅ [EN] TypeScript now knows: validOk is CreateAnyResult<TMap><br/>
  // ✅ [RU] Теперь TypeScript знает: validOk — CreateAnyResult<TMap>
  console.log('✅ Ok:', validOk['value']); // 42
}

console.log('\n=== Тест 2: Ok с некорректным значением ===');
const invalidOk = { type: 'ok', value: -5 } as unknown;

if (!isApiResult(invalidOk, apiResultValidators)) {
  console.log('❌ Ok rejected: value must be positive');
}

console.log('\n=== Тест 3: Корректный Err ===');
const validErr = { type: 'err', error: 'Something went wrong' } as unknown;

if (
  isApiResult(validErr, apiResultValidators) &&
  validErr !== undefined &&
  validErr.type === 'err'
) {
  // ✅ [EN] TypeScript now knows: validErr is CreateAnyResult<TMap><br/>
  // ✅ [RU] Теперь TypeScript знает: validErr — CreateAnyResult<TMap>
  console.log('✅ Err:', validErr['error']); // Something went wrong
}

console.log('\n=== Тест 4: Err с пустой строкой ===');
const invalidErr = { type: 'err', error: '' } as unknown;

if (!isApiResult(invalidErr, apiResultValidators)) {
  console.log('❌ Err rejected: error must be non-empty string');
}

console.log('\n=== Тест 5: Некорректный тип ===');
const unknownType = { type: 'warning', message: 'Be careful' } as unknown;

if (!isApiResult(unknownType, apiResultValidators)) {
  console.log('❌ Unknown type rejected');
}

console.log('\n=== Тест 6: Ok с лишним полем (strictFields: true) ===');
const okWithExtraField = {
  type: 'ok',
  value: 42,
  extra: 'not allowed',
} as unknown;

if (!isApiResult(okWithExtraField, apiResultValidators)) {
  console.log('❌ Ok with extra field rejected (strictFields)');
}

console.log('\n=== Тест 7: Err без обязательного поля ===');
const errWithoutError = { type: 'err' } as unknown;

if (!isApiResult(errWithoutError, apiResultValidators)) {
  console.log('❌ Err without error field rejected');
}


