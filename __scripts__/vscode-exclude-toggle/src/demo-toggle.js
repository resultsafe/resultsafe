#!/usr/bin/env node

// TODO не рабочий
import { main as toggleFiles } from './toggle-files-exclude.js';
import { ask } from './utils/io.js';

const runDemo = async () => {
  console.log('🎯 Demo интерактивного меню');

  const answer = await ask('Хотите переключить все files.exclude? (y/N): ');

  if (answer.toLowerCase() === 'y') {
    await toggleFiles('exclude-patterns.yaml');
  } else {
    console.log('Отмена.');
  }
};

await runDemo();
