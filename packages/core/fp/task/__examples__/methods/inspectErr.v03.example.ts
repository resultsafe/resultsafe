import { inspectErr, type Task } from '@resultsafe/core-fp-task';

// 3️⃣ Пользовательские настройки — тема интерфейса

type Settings = { theme: string };

const fetchSettings: Task<Settings> = () =>
  new Promise((res, rej) =>
    setTimeout(
      () =>
        Math.random() > 0.5
          ? res({ theme: 'dark' })
          : rej(new Error('Settings fetch failed')),
      12,
    ),
  );

const loggedSettings = inspectErr(fetchSettings, (err) => {
  console.error('⚙️ Settings error:', err);
});

async function runSettingsExample() {
  try {
    const settings = await loggedSettings();
    console.log('✅ User theme:', settings.theme);
  } catch {
    console.log('⚠️ Applying default theme');
  }
}

runSettingsExample();


