// __scripts__/package-json/check-scripts-paths.ts
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// ESM замена для __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// путь к package.json пакета
const packageJsonPath = path.resolve(__dirname, '../../package.json');
const packageDir = path.dirname(packageJsonPath);

// читаем package.json
const pkg = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
const scripts: Record<string, string> = pkg.scripts;

type ScriptCheckResult = {
  script: string;
  path: string;
  status: '✅ найден' | '❌ не найден';
  filesFound?: number; // для wildcard
};

const results: ScriptCheckResult[] = [];
let errors = 0;

function resolveWildcard(p: string): { path: string; filesFound: number } {
  const dir = path.resolve(packageDir, path.dirname(p.replace('*', '')));
  if (!fs.existsSync(dir)) return { path: p, filesFound: 0 };

  const files = fs
    .readdirSync(dir)
    .filter(
      (f) => f.endsWith('.ts') || f.endsWith('.js') || f.endsWith('.d.ts'),
    );
  return { path: p, filesFound: files.length };
}

// фильтруем потенциальные пути
function extractPaths(scriptValue: string): string[] {
  const args = scriptValue.split(/\s+/);
  return args.filter((a) => a.startsWith('.') || a.startsWith('/'));
}

// проверяем все пути
for (const [name, cmd] of Object.entries(scripts)) {
  const paths = extractPaths(cmd);
  if (paths.length === 0) {
    // команды без путей
    results.push({ script: name, path: '(нет путей)', status: '✅ найден' });
    continue;
  }

  paths.forEach((p) => {
    if (p.includes('*')) {
      const { path: wp, filesFound } = resolveWildcard(p);
      if (filesFound === 0) {
        errors++;
        results.push({
          script: name,
          path: wp,
          status: '❌ не найден',
          filesFound,
        });
      } else {
        results.push({
          script: name,
          path: wp,
          status: '✅ найден',
          filesFound,
        });
      }
    } else {
      const fullPath = path.resolve(packageDir, p);
      if (!fs.existsSync(fullPath)) {
        errors++;
        results.push({ script: name, path: fullPath, status: '❌ не найден' });
      } else {
        results.push({ script: name, path: fullPath, status: '✅ найден' });
      }
    }
  });
}

// вывод
console.log('=== Проверка всех путей scripts ===');
results.forEach((r) => {
  if (r.filesFound !== undefined) {
    console.log(
      `${r.path} → ${r.status} ${r.filesFound} файл(ов)  (скрипт: "${r.script}")`,
    );
  } else {
    console.log(`${r.path} → ${r.status}  (скрипт: "${r.script}")`);
  }
});

console.log(
  `\nИтог: проверено скриптов: ${Object.keys(scripts).length}, ошибок: ${errors}\n`,
);

if (errors > 0) process.exit(1);
