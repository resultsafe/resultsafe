// // Node.js scoped
// import { join } from 'node:path';

// import { something } from '@resultsafe/utils';
// // Встроенные модули
// import fs from 'fs';

// // Внутренние алиасы
// import { config } from '@/config';
// import { myHelper } from '@/lib/helpers';
// import { unusedFunction } from '@/lib/unused';
// // Неиспользуемые импорты, которые мы хотим сохранить
// import type { User } from '@/types/user';

// // Применение всех импортов
// function readConfigFile(): string {
//   const filePath = join(__dirname, config.filename);
//   return fs.readFileSync(filePath, 'utf-8');
// }

// function runHelper() {
//   const result = myHelper('input');
//   console.log('Helper result:', result);
// }

// function runSomething() {
//   something();
// }

// function simulateUser(user: User) {
//   console.log('Simulated user:', user);
// }

// function keepUnusedAlive() {
//   // eslint-disable-next-line @typescript-eslint/no-unused-vars
//   const temp = unusedFunction;
//   console.log('Unused function preserved for future use.');
// }

// // Вызов функций
// readConfigFile();
// runHelper();
// runSomething();
// simulateUser({ id: '123', name: 'Test' });
// keepUnusedAlive();
