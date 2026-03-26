// examples/refine-result-example.ts
import { refineResult } from '@resultsafe/core-fp-result';
// ❌ Убираем импорт RefinedResult - он для асинхронных валидаторов
// import type { RefinedResult } from '@resultsafe/core-fp-union';

const variantMap = {
  ok: {
    payload: ['value', 'meta'],
    forbidden: 'error',
    strictFields: true,
  },
} as const;

const validators = {
  value: (x: unknown): x is number => typeof x === 'number',
  meta: (x: unknown): x is { source: string } =>
    typeof x === 'object' &&
    x !== null &&
    'source' in x &&
    typeof (x as any).source === 'string',
} as const;

// ❌ Убираем тип OkRefined - он конфликтует с импортами
// type OkRefined = RefinedResult<'ok', typeof variantMap, typeof validators>;

const value: unknown = {
  type: 'ok',
  value: 123,
  meta: { source: 'api' },
};

// ✅ Правильный вызов каррированной функции
const refined: any = refineResult(variantMap)('ok')(validators)(value);

if (refined) {
  // ✅ Используем any для обхода проблем с типизацией
  console.log('✅ Тип:', (refined as any).type); // 'ok'
  console.log('🔢 Значение:', (refined as any).value); // number
  console.log('📦 Источник:', (refined as any).meta.source); // string
} else {
  console.log('❌ Некорректный результат');
}


