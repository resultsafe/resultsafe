import { fromPromise, type Task } from '@resultsafe/core-fp-task';
import { promises as fs } from 'fs';

// Создаем Task для чтения конфигурации
const readConfig: Task<{
  appName: string;
  port: number;
  theme: string;
  features: Record<string, boolean>;
}> = fromPromise(
  fs.readFile('./internal/config.json', 'utf-8').then(JSON.parse),
);

async function runExample() {
  try {
    const config = await readConfig();
    console.log('App Name:', config.appName);
    console.log('Port:', config.port);
    console.log('Theme:', config.theme);
    console.log('Features:', config.features);
  } catch (err) {
    console.error('Failed to read config:', err);
  }
}

runExample();


