import fs from 'node:fs';
import * as path from 'node:path';
import prettier from 'prettier';
import { fileURLToPath } from 'url';

// Пути
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const tsconfigAliasesPath = path.resolve(
  __dirname,
  '../../tsconfig.aliases.json',
);
const esmDir = path.resolve(__dirname, '../../config/aliases/esm');
const cjsDir = path.resolve(__dirname, '../../config/aliases/cjs');

// Читаем tsconfig.aliases.json
const tsconfigRaw = fs.readFileSync(tsconfigAliasesPath, 'utf-8');
const tsconfig = JSON.parse(tsconfigRaw);
const paths = tsconfig.compilerOptions.paths || {};

// Генерация содержимого для ESM (TypeScript)
const generateEsmContent = () => {
  let content = `import * as path from 'node:path';\nimport { fileURLToPath } from 'url';\n\n`;
  content += `const __filename = fileURLToPath(import.meta.url);\n`;
  content += `const __dirname = path.dirname(__filename);\n\n`;
  content += `export const aliases = {\n`;
  for (const [alias, targets] of Object.entries(paths)) {
    const target = Array.isArray(targets) ? targets[0] : targets;
    const cleanTarget = target.replace(/\/\*$/, '');
    content += `  '${alias}': path.resolve(__dirname, '${cleanTarget}'),\n`;
  }
  content += '};\n';
  return content;
};

const generateCjsContent = () => {
  let content = `const path = require('node:path');\n\n`;
  content += `const aliases = {\n`;

  for (const [alias, targets] of Object.entries(paths)) {
    const target = Array.isArray(targets) ? targets[0] : targets;
    const cleanTarget = target.replace(/\/\*$/, '');

    // формируем путь с прямыми слешами
    const relTarget = path
      .relative(cjsDir, path.resolve(__dirname, '../../', cleanTarget))
      .split(path.sep)
      .join('/');

    content += `  '${alias}': path.resolve(__dirname, '${relTarget}'),\n`;
  }

  content += '};\n\nmodule.exports = aliases;\n';
  return content;
};

// Форматирование через Prettier (асинхронно)
const formatTs = async (code) =>
  await prettier.format(code, { parser: 'typescript' });
const formatJs = async (code) =>
  await prettier.format(code, { parser: 'babel' });

// Основная функция
async function main() {
  try {
    // Создаём директории, если их нет
    for (const dir of [esmDir, cjsDir]) {
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    }

    // Генерируем и форматируем содержимое
    const esmContent = await formatTs(generateEsmContent());
    const cjsContent = await formatJs(generateCjsContent());

    // Пишем файлы
    fs.writeFileSync(path.join(esmDir, 'aliases.ts'), esmContent, 'utf-8');
    fs.writeFileSync(path.join(esmDir, 'aliases.d.ts'), esmContent, 'utf-8');
    fs.writeFileSync(path.join(cjsDir, 'aliases.cjs'), cjsContent, 'utf-8');
    fs.writeFileSync(path.join(cjsDir, 'aliases.d.ts'), esmContent, 'utf-8');

    console.log(`✅ aliases успешно созданы:
  ESM: ${esmDir}/aliases.ts
  ESM Types: ${esmDir}/aliases.d.ts
  CJS: ${cjsDir}/aliases.cjs
  ESM Types: ${cjsDir}/aliases.d.ts
`);
  } catch (error) {
    console.error('❌ Ошибка при генерации aliases:', error);
    process.exit(1);
  }
}

// Запускаем
main();
