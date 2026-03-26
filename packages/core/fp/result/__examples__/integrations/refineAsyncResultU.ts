// examples/async-refinement-example.ts
import {
  matchVariantStrict,
  refineAsyncResultU,
} from '@resultsafe/core-fp-result';

// Определение вариантов
const UserVariant = {
  registered: {
    payload: ['id', 'email', 'profile'],
    forbidden: 'error',
    strictFields: true,
  },
  guest: {
    payload: ['sessionId'],
    forbidden: 'id',
    strictFields: true,
  },
  error: {
    payload: ['code', 'message'],
    forbidden: 'id',
    strictFields: true,
  },
} as const;

// Асинхронные валидаторы
const asyncValidators = {
  id: async (x: unknown): Promise<boolean> => {
    if (typeof x !== 'number') return false;
    return validateUserIdInDatabase(x);
  },
  email: async (x: unknown): Promise<boolean> => {
    if (typeof x !== 'string') return false;
    const isValidFormat = await validateEmailFormat(x);
    const exists = await checkEmailExists(x);
    return isValidFormat && exists;
  },
  sessionId: async (x: unknown): Promise<boolean> => {
    if (typeof x !== 'string') return false;
    return validateSession(x);
  },
} as const;

// Асинхронные проверки
async function validateUserIdInDatabase(id: number): Promise<boolean> {
  await new Promise((resolve) => setTimeout(resolve, 100));
  return id > 0 && id < 1000000;
}

async function validateEmailFormat(email: string): Promise<boolean> {
  await new Promise((resolve) => setTimeout(resolve, 50));
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

async function checkEmailExists(email: string): Promise<boolean> {
  await new Promise((resolve) => setTimeout(resolve, 150));
  return email.includes('@example.com');
}

async function validateSession(sessionId: string): Promise<boolean> {
  await new Promise((resolve) => setTimeout(resolve, 75));
  return sessionId.length > 10 && sessionId.startsWith('sess_');
}

// Тестируемые данные
const userData: unknown = {
  type: 'registered',
  id: 12345,
  email: 'user@example.com',
  profile: { name: 'John Doe', age: 30 },
};

const guestData: unknown = {
  type: 'guest',
  sessionId: 'sess_abc123xyz',
};

const errorData: unknown = {
  type: 'error',
  code: 'AUTH_001',
  message: 'Authentication failed',
};

// Асинхронная валидация
async function main() {
  console.log('🔍 Начинаем асинхронную валидацию...\n');

  // Валидация зарегистрированного пользователя
  console.log('Проверяем зарегистрированного пользователя:');
  const registeredUser = await refineAsyncResultU(
    userData,
    'registered',
    UserVariant,
    {
      id: asyncValidators.id,
      email: asyncValidators.email,
    },
  );

  if (registeredUser) {
    console.log(`✅ Пользователь ${registeredUser['id']} прошёл все проверки`);
    console.log(`📧 Email: ${registeredUser['email']}`);
  } else {
    console.log('❌ Пользователь не прошёл валидацию');
  }

  console.log('\n' + '='.repeat(50) + '\n');

  // Валидация гостя
  console.log('Проверяем гостя:');
  const guestUser = await refineAsyncResultU(guestData, 'guest', UserVariant, {
    sessionId: asyncValidators.sessionId,
  });

  if (guestUser) {
    console.log(`✅ Гость с сессией ${guestUser['sessionId']} подтверждён`);
  } else {
    console.log('❌ Гость не прошёл валидацию');
  }

  console.log('\n' + '='.repeat(50) + '\n');

  // Валидация ошибки - используем match для правильной типизации
  console.log('Проверяем ошибку:');
  const errorResult = await refineAsyncResultU(
    errorData,
    'error',
    UserVariant,
    {},
  );

  if (errorResult) {
    // Используем matchVariantStrict для правильной типизации
    matchVariantStrict(errorResult)
      .with('error', (err) => {
        console.log(`❌ Ошибка: ${err['code']} - ${err['message']}`);
      })
      .run();
  } else {
    console.log('❌ Ошибка не прошла валидацию');
  }
}

// Запуск примера
main().catch((error) => {
  console.error('💥 Фатальная ошибка:', error);
  process.exit(1);
});


