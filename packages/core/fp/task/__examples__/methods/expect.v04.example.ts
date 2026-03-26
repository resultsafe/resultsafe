import { expect, type Task } from '@resultsafe/core-fp-task';

// 3️⃣ Настройки пользователя — тема интерфейса

type Settings = { theme: string };

const fetchUserSettings: Task<Settings> = () =>
  new Promise((res, rej) =>
    setTimeout(
      () =>
        Math.random() > 0.5
          ? res({ theme: 'dark' })
          : rej(new Error('Settings API failed')),
      12,
    ),
  );

async function runSettingsExample() {
  try {
    const settings = await expect(
      fetchUserSettings,
      'Failed to fetch user settings',
    );
    console.log(`✅ User theme: ${settings.theme}`);
  } catch (err) {
    if (err instanceof Error)
      console.error('❌ Error fetching settings:', err.message);
  }
}

runSettingsExample();


