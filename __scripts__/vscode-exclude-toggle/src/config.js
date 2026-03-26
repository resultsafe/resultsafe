import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));

export const paths = {
  vscodeSettings: join(process.cwd(), '../../', '.vscode', 'settings.json'),
  cache: join(__dirname, '.exclude-cache.json'),
  patterns: join(__dirname, 'exclude-patterns.json'), // дефолтный JSON, если YAML не указан
};

export const defaults = {
  vscodeSettings: {},
  cache: { lastSelectedPattern: null, lastSelectedScope: null },
  patterns: {
    'files.exclude': {
      '**/.DS_Store': true,
      '**/node_modules': true,
      '**/dist': false,
      '**/*.log': false,
      '**/coverage': false,
      '**/.git': true,
      '**/.env': false,
      '**/build': false,
    },
    'search.exclude': {
      '**/node_modules': true,
      '**/dist': true,
      '**/*.min.js': false,
      '**/coverage': true,
    },
    'files.watcherExclude': {
      '**/node_modules/**': true,
      '**/.git/objects/**': true,
      '**/dist/**': false,
      '**/*.tmp': false,
    },
  },
};
