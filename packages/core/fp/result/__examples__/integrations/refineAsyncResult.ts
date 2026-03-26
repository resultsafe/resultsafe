import { refineAsyncResult } from '@resultsafe/core-fp-result';

// Конфигурация вариантов
const variantMap = {
  ok: {
    payload: ['value'],
    forbidden: 'code',
    strictFields: true,
  },
  err: {
    payload: ['code', 'message'],
    forbidden: 'value',
    strictFields: true,
  },
} as const;

// Асинхронные валидаторы
const asyncValidators = {
  value: async (x: unknown): Promise<boolean> => {
    if (typeof x !== 'number') return false;
    return checkValueInDB(x);
  },
} as const;

async function checkValueInDB(value: number): Promise<boolean> {
  await new Promise((res) => setTimeout(res, 100));
  return value > 0 && value < 1000;
}

const input: unknown = {
  type: 'ok',
  value: 42,
};

async function main() {
  console.log('🔍 Начинаем асинхронную валидацию...');

  // Используем каррированную версию
  const refined =
    await refineAsyncResult(variantMap)('ok')(asyncValidators)(input);

  if (!refined) {
    console.log('❌ Ошибка: структура или значение некорректны');
    return;
  }

  // Простое решение - используем только возможные варианты
  // Поскольку мы валидируем 'ok', вариант 'err' невозможен
  if (refined.type === 'ok') {
    console.log(`✅ ok: ${refined['value']} прошёл проверку`);
  }
  // Вариант 'err' невозможен, так как мы валидируем только 'ok'
}

main().catch(console.error);


