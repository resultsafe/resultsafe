// examples/async-refinement-example.ts
import { refineResult } from '@resultsafe/core-fp-result';

// Конфигурация вариантов
const variantMap = {
  ok: {
    payload: ['value', 'meta'] as const,
    forbidden: 'error',
    strictFields: true,
  },
} as const;

// Асинхронные валидаторы (без строгой типизации для примера)
const validators: any = {
  value: async (x: unknown): Promise<boolean> => {
    return typeof x === 'number';
  },
  meta: async (x: unknown): Promise<boolean> => {
    return (
      typeof x === 'object' &&
      x !== null &&
      'source' in x &&
      typeof (x as { source?: unknown }).source === 'string'
    );
  },
};

// Тестовые данные
const values: unknown[] = [
  { type: 'ok', value: 123, meta: { source: 'api' } },
  { type: 'ok', value: 'oops', meta: { source: 'api' } }, // ❌ value не number
  { type: 'ok', value: 42, meta: { source: 'db' } },
  { type: 'err', code: 500, message: 'fail' }, // ❌ другой тип
];

// Асинхронная обработка
async function runRefinement() {
  console.log('🔍 Начинаем асинхронную валидацию...');

  // Обработка всех значений
  for (const [index, value] of values.entries()) {
    const refined: any =
      await refineResult(variantMap)('ok')(validators)(value);

    if (refined) {
      console.log(
        `✅ [${index}] ok: ${refined.value} from ${refined.meta.source}`,
      );
    } else {
      console.log(`❌ [${index}] не прошёл валидацию`);
    }
  }
}

// Запуск примера
runRefinement().catch(console.error);


