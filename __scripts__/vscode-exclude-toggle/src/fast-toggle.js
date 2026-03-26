#!/usr/bin/env node
import { writeFileSync } from 'node:fs';
import { defaults, paths } from './config.js';
import { ask } from './utils/io.js';
import { loadJSON } from './utils/json.js';
import { loadPatternsYAML } from './utils/yaml-loader.js';

const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
  yellow: '\x1b[33m',
};

const log = {
  info: (msg) => console.log(`${colors.cyan}ℹ${colors.reset} ${msg}`),
  success: (msg) => console.log(`${colors.green}✓${colors.reset} ${msg}`),
  warning: (msg) => console.log(`${colors.yellow}⚠${colors.reset} ${msg}`),
  error: (msg) => console.log(`${colors.red}✗${colors.reset} ${msg}`),
};

const saveJSON = (path, data) =>
  writeFileSync(path, JSON.stringify(data, null, 2));
const loadVSCodeSettings = () =>
  loadJSON(paths.vscodeSettings, defaults.vscodeSettings);
const saveVSCodeSettings = (settings) =>
  saveJSON(paths.vscodeSettings, settings);
const loadCache = () => loadJSON(paths.cache, defaults.cache);
const saveCache = (pattern, scope) =>
  saveJSON(paths.cache, {
    lastSelectedPattern: pattern,
    lastSelectedScope: scope,
    timestamp: new Date().toISOString(),
  });

const main = async () => {
  const yamlPath = process.argv[2] || 'exclude-patterns.yaml';
  const patterns = loadPatternsYAML(yamlPath);
  const cache = loadCache();

  if (!cache.lastSelectedPattern || !cache.lastSelectedScope) {
    log.warning('Нет сохраненного выбора. Используйте интерактивный режим.');
    return;
  }

  const settings = loadVSCodeSettings();
  const { lastSelectedPattern: pattern, lastSelectedScope: scope } = cache;

  if (!patterns[scope] || !(pattern in patterns[scope])) {
    log.error('Сохраненный паттерн больше не существует.');
    return;
  }

  const current = settings[scope]?.[pattern] ?? patterns[scope][pattern];
  const next = !current;

  log.info(
    `Последний выбор: [${colors.cyan}${scope}${colors.reset}] ${pattern}`,
  );
  log.info(
    `Текущее состояние: ${current ? `${colors.red}EXCLUDED${colors.reset}` : `${colors.green}INCLUDED${colors.reset}`}`,
  );

  const answer = await ask(
    `\nНажмите ${colors.bright}ENTER${colors.reset} для переключения: `,
  );

  if (answer.trim() === '') {
    if (!settings[scope]) settings[scope] = {};
    settings[scope][pattern] = next;
    saveVSCodeSettings(settings);
    saveCache(pattern, scope);

    const status = next
      ? `${colors.red}EXCLUDED${colors.reset}`
      : `${colors.green}INCLUDED${colors.reset}`;
    log.success(
      `[${colors.cyan}${scope}${colors.reset}] ${pattern} → ${status}`,
    );
  } else {
    log.info('Отмена переключения.');
  }
};

await main();
