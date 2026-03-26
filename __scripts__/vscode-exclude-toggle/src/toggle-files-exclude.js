#!/usr/bin/env node
import { writeFileSync } from 'node:fs';
import { defaults, paths } from './config.js';
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
const loadCache = () => loadJSON(paths.cache, { lastFilesExcludeState: null });
const saveCache = (state) =>
  saveJSON(paths.cache, { lastFilesExcludeState: state });

const main = async () => {
  const yamlPath = process.argv[2] || 'exclude-patterns.yaml';
  const patterns = loadPatternsYAML(yamlPath);
  const settings = loadVSCodeSettings();
  const cache = loadCache();

  if (!patterns['files.exclude']) {
    log.error('В YAML нет секции files.exclude');
    return;
  }

  const allPatterns = Object.keys(patterns['files.exclude']);

  // Определяем новое состояние
  const nextState = cache.lastFilesExcludeState === true ? false : true;

  if (!settings['files.exclude']) settings['files.exclude'] = {};

  allPatterns.forEach((pattern) => {
    settings['files.exclude'][pattern] = nextState;
  });

  saveVSCodeSettings(settings);
  saveCache(nextState);

  const status = nextState
    ? `${colors.red}EXCLUDED${colors.reset}`
    : `${colors.green}INCLUDED${colors.reset}`;
  log.success(`Все паттерны files.exclude → ${status}`);
};

await main();
