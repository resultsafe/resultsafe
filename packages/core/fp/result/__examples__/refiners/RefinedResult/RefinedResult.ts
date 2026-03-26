// examples/manual-validation-example.ts

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

const value: unknown = {
  type: 'ok',
  value: 123,
  meta: { source: 'api' },
};

// Простая ручная проверка без строгой типизации импортов
function isValidOk(v: unknown): boolean {
  if (
    typeof v === 'object' &&
    v !== null &&
    'type' in v &&
    (v as any).type === 'ok' &&
    validators.value((v as any).value) &&
    validators.meta((v as any).meta)
  ) {
    return true;
  }
  return false;
}

// Использование
if (isValidOk(value)) {
  console.log('✅ Тип:', (value as any).type);
  console.log('🔢 Значение:', (value as any).value);
  console.log('📦 Источник:', (value as any).meta.source);
} else {
  console.log('❌ Некорректный результат');
}
