// __scripts__/check-exports.ts
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

// ESM замена для __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// путь к package.json пакета
const packageJsonPath = path.resolve(__dirname, '../../package.json');
const packageDir = path.dirname(packageJsonPath);

// читаем package.json
const pkg = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
const exportsField = pkg.exports;

let errors = 0;
let warnings = 0;

function checkFile(filePath: string) {
  if (filePath.includes('*')) {
    const dir = path.resolve(
      packageDir,
      path.dirname(filePath.replace('*', '')),
    );
    const files = fs.existsSync(dir)
      ? fs.readdirSync(dir).filter((f) => f.endsWith('.d.ts'))
      : [];
    if (files.length === 0) {
      warnings++;
      console.warn(`⚠ Wildcard path "${filePath}" не содержит файлов`);
      return { path: filePath, status: '⚠ пусто' };
    }
    return { path: filePath, status: `✅ ${files.length} файл(ов)` };
  } else {
    const fullPath = path.resolve(packageDir, filePath);
    if (!fs.existsSync(fullPath)) {
      errors++;
      console.error(`❌ Файл не найден: ${fullPath}`);
      return { path: filePath, status: '❌ отсутствует' };
    }
    return { path: filePath, status: '✅ найден' };
  }
}

const results: { path: string; status: string }[] = [];

for (const key of Object.keys(exportsField)) {
  const exportValue = exportsField[key];
  if (exportValue.types) {
    const res = checkFile(exportValue.types);
    results.push(res);
  }
}

console.log('\n=== Проверка всех путей exports ===');
results.forEach((r) => console.log(r.path, '→', r.status));

console.log(
  `\nИтог: ${results.length} проверено, ${errors} ошибок, ${warnings} предупреждений\n`,
);

if (errors > 0) process.exit(1);
