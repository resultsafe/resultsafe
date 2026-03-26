import { isErrOfType } from '@resultsafe/core-fp-union';

const variantMap = {
  err: {
    payload: ['code', 'message'],
    forbidden: 'value',
    strictFields: true,
  },
} as const;

const value: unknown = {
  type: 'err',
  code: 404,
  message: 'Not found',
};

const isValidError = isErrOfType(variantMap)(value, {
  code: (x): x is number => typeof x === 'number',
  message: (x): x is string => typeof x === 'string',
});

if (isValidError) {
  const err = value as { code: number; message: string };
  console.log('❌ Ошибка с кодом:', err.code);
  console.log('📩 Сообщение:', err.message);
}


