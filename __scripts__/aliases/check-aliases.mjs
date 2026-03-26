#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'url';

// Пути
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const aliasesFile = path.resolve(
  __dirname,
  '../../config/aliases/dist/aliases.js',
);

// Конвертация пути в file:// URL для Windows и ESM
const aliasesURL = pathToFileURL(aliasesFile).href;

// Импортируем алиасы
import(aliasesURL)
  .then(({ aliases }) => {
    console.log('🔍 Проверка сгенерированных алиасов...\n');
    let hasError = false;

    for (const [alias, targetPath] of Object.entries(aliases)) {
      if (!fs.existsSync(targetPath)) {
        console.error(`❌ ${alias} -> ${targetPath} не найден`);
        hasError = true;
      } else {
        console.log(`✅ ${alias} -> ${targetPath}`);
      }
    }

    if (hasError) {
      console.log(
        '\n⚠️ Некоторые пути не существуют. Проверь tsconfig.aliases.json и структуру проекта.',
      );
      process.exit(1);
    } else {
      console.log('\n🎉 Все алиасы корректны.');
      process.exit(0);
    }
  })
  .catch((err) => {
    console.error('❌ Ошибка импорта aliases.js:', err);
    process.exit(1);
  });
