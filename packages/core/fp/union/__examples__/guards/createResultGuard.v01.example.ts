// example-createResultGuard-simple.ts

import { isResult } from '@resultsafe/core-fp-union';

/**
 * @description
 * [EN] Configuration map for Result-like discriminated union<br/>
 * [RU] Карта конфигурации для Result-подобного дискриминантного объединения<br/>
 */
const variantMap = {
  ok: { payload: 'value', forbidden: 'error' },
  err: { payload: 'error', forbidden: 'value' },
} as const;

/**
 * @description
 * [EN] Type guard for discriminated union based on variant map<br/>
 * [RU] Type guard для дискриминантного объединения на основе карты вариантов<br/>
 */
const isValid = isResult(variantMap);

/**
 * @description
 * [EN] Test value to validate<br/>
 * [RU] Тестовое значение для валидации<br/>
 */
const result: unknown = { type: 'ok', value: 42 };

if (isValid(result) && result !== undefined && result.type === 'ok') {
  // ✅ [EN] TypeScript now knows: result is CreateAnyResult<typeof variantMap><br/>
  // ✅ [RU] Теперь TypeScript знает: result — CreateAnyResult<typeof variantMap>
  console.log('value:', result['value']); // ✅ OK
}


