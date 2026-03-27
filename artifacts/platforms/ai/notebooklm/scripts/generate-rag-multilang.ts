#!/usr/bin/env node
/**
 * NotebookLM RAG Generator with Multi-language Support
 *
 * Generates RAG-optimized documentation in multiple languages
 * while keeping code examples unchanged.
 */

import { parse } from 'comment-parser';
import { mkdirSync, readdirSync, readFileSync, writeFileSync } from 'fs';

const EXAMPLES_DIR =
  'E:/10-projects/lib/resultsafe/packages/core/fp/result/__examples__';
const OUTPUT_BASE =
  'E:/10-projects/lib/resultsafe/artifacts/platforms/ai/notebooklm/output';

// Section translations
const SECTION_TITLES: Record<string, Record<string, string>> = {
  en: {
    'Quick Answer': 'Quick Answer',
    'Detailed Explanation': 'Detailed Explanation',
    'Example Code': 'Example Code',
    'When to Use': 'When to Use',
    'Key Functions': 'Key Functions',
    'Related Concepts': 'Related Concepts',
    Metadata: 'Metadata',
    Tags: 'Tags',
    Difficulty: 'Difficulty',
    Module: 'Module',
  },
  ru: {
    'Quick Answer': 'Краткий ответ',
    'Detailed Explanation': 'Подробное объяснение',
    'Example Code': 'Пример кода',
    'When to Use': 'Когда использовать',
    'Key Functions': 'Ключевые функции',
    'Related Concepts': 'Связанные концепции',
    Metadata: 'Метаданные',
    Tags: 'Теги',
    Difficulty: 'Сложность',
    Module: 'Модуль',
  },
};

// Difficulty translations
const DIFFICULTY: Record<string, Record<string, string>> = {
  en: {
    beginner: 'Beginner',
    intermediate: 'Intermediate',
    advanced: 'Advanced',
  },
  ru: {
    beginner: 'Начинающий',
    intermediate: 'Средний',
    advanced: 'Продвинутый',
  },
};

// Category file names
const CATEGORY_NAMES: Record<string, Record<string, string>> = {
  en: {
    '00-quick-start': '01-getting-started',
    '01-api-reference': '02-core-concepts',
    '02-patterns': '07-real-world',
  },
  ru: {
    '00-quick-start': '01-nachalo-raboty',
    '01-api-reference': '02-osnovnye-kontseptsii',
    '02-patterns': '07-real-world',
  },
};

// Category titles
const CATEGORY_TITLES: Record<string, Record<string, string>> = {
  en: {
    '01-getting-started': 'Getting Started with ResultSafe',
    '02-core-concepts': 'Core Concepts: Ok, Err, Result',
    '07-real-world': 'Real-World Production Patterns',
  },
  ru: {
    '01-nachalo-raboty': 'Начало работы с ResultSafe',
    '02-osnovnye-kontseptsii': 'Основные концепции: Ok, Err, Result',
    '07-real-world': 'Production Паттерны для Реального Мира',
  },
};

// Description translations
const DESCRIPTION_TRANSLATIONS: Record<string, string> = {
  'Learn to': 'Изучите как',
  Creating: 'Создание',
  'Basic usage': 'Базовое использование',
  'Complete introduction': 'Полное введение',
  Demonstrates: 'Демонстрирует',
  'Show how to': 'Показывает как',
  'Error handling': 'Обработка ошибок',
  'Pattern matching': 'Сопоставление паттернов',
  'Type guards': 'Защиты типов',
  'Access values': 'Доступ к значениям',
  Safely: 'Безопасно',
  'With Result type': 'С типом Result',
  'Quick start': 'Быстрый старт',
  'Introduction to': 'Введение в',
  Fundamentals: 'Основы',
  'Real-world': 'Реальный мир',
  Production: 'Продакшн',
  Patterns: 'Паттерны',
  Async: 'Асинхронный',
  HTTP: 'HTTP',
  Validation: 'Валидация',
  Events: 'События',
  Workers: 'Воркеры',
};

// Title translations
const TITLE_TRANSLATIONS: Record<string, string> = {
  'Creating Ok Values': 'Создание значений Ok',
  'Creating Err Values': 'Создание значений Err',
  'Basic Usage': 'Базовое использование',
  'With Generics': 'С дженериками',
  'Real World': 'Реальный мир',
  'With Custom Error': 'С пользовательской ошибкой',
  'Pattern Matching': 'Сопоставление паттернов',
  'Error Handling': 'Обработка ошибок',
  'Quick Start': 'Быстрый старт',
  Introduction: 'Введение',
  Fundamentals: 'Основы',
  Advanced: 'Продвинутый',
};

interface RAGDoc {
  module: string;
  title: string;
  question: string;
  answer: string;
  description: string;
  code: string;
  tags: string[];
  category: string;
  difficulty: string;
  related: string[];
}

function translateDescription(description: string, lang: string): string {
  if (lang === 'en') return description;

  let translated = description;
  for (const [en, ru] of Object.entries(DESCRIPTION_TRANSLATIONS)) {
    translated = translated.replace(new RegExp(en, 'gi'), ru);
  }

  return translated;
}

function translateTitle(title: string, lang: string): string {
  if (lang === 'en') return title;

  let translated = title;
  for (const [en, ru] of Object.entries(TITLE_TRANSLATIONS)) {
    translated = translated.replace(new RegExp(en, 'gi'), ru);
  }

  return translated;
}

function translateQuestion(description: string, lang: string): string {
  if (lang === 'en')
    return `How do I ${description.toLowerCase().split('.')[0]}?`;

  const action = description.toLowerCase().split('.')[0];

  const actionMap: Record<string, string> = {
    'learn to': 'изучить',
    creating: 'создать',
    demonstrates: 'продемонстрировать',
    'show how to': 'показать как',
    'error handling': 'обработать ошибки',
    'pattern matching': 'использовать pattern matching',
    'type guards': 'использовать type guards',
    'access values': 'получить значения',
    'quick start': 'быстро начать',
    'introduction to': 'познакомиться с',
    'basic usage': 'использовать базово',
    'real-world': 'применить в реальном мире',
    production: 'использовать в продакшне',
  };

  let translatedAction = action;
  for (const [en, ru] of Object.entries(actionMap)) {
    translatedAction = translatedAction.replace(new RegExp(en, 'gi'), ru);
  }

  return `Как мне ${translatedAction}?`;
}

function translateAnswer(answer: string, lang: string): string {
  if (lang === 'en') return answer;

  return answer
    .replace(/Use/g, 'Используйте')
    .replace(/to handle this/g, 'для обработки');
}

function parseExampleFile(
  filePath: string,
  lang: string = 'en',
): RAGDoc | null {
  const content = readFileSync(filePath, 'utf-8');
  const comments = parse(content);

  const jsdoc = comments.find((c) => c.tags.some((t) => t.tag === 'module'));
  if (!jsdoc) return null;

  const getTag = (name: string) =>
    jsdoc.tags.find((t) => t.tag === name)?.description || '';

  const code = content.replace(/\/\*\*[\s\S]*?\*\//, '').trim();

  const descriptionEn = getTag('description');
  const titleEn = getTag('title') || 'Example';

  const description =
    lang === 'ru' ? translateDescription(descriptionEn, lang) : descriptionEn;
  const title = lang === 'ru' ? translateTitle(titleEn, lang) : titleEn;
  const question =
    lang === 'ru'
      ? translateQuestion(descriptionEn, lang)
      : `How do I ${descriptionEn.toLowerCase().split('.')[0]}?`;

  const functions =
    code.match(/\b(Ok|Err|match|map|andThen|unwrap|expect|tap|inspect)\b/g) ||
    [];
  const answerEn = `Use ${[...new Set(functions)].join(', ')} to handle this.`;
  const answer = lang === 'ru' ? translateAnswer(answerEn, lang) : answerEn;

  const relativePath = filePath.replace(EXAMPLES_DIR + '/', '');
  const categoryFolder = relativePath.split('/')[0] || 'examples';

  return {
    module: getTag('module'),
    title,
    question,
    answer,
    description,
    code,
    tags: getTag('tags')
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean),
    category: categoryFolder,
    difficulty: getTag('difficulty') || 'intermediate',
    related: extractRelated(code),
  };
}

function extractRelated(code: string): string[] {
  const allFunctions = code.match(/\b[a-zA-Z]+\b/g) || [];
  const relevant = allFunctions.filter((f) =>
    [
      'Result',
      'Ok',
      'Err',
      'match',
      'map',
      'andThen',
      'unwrap',
      'expect',
    ].includes(f),
  );
  return [...new Set(relevant)];
}

function formatForNotebookLM(docs: RAGDoc[], lang: string = 'en'): string {
  const titles = SECTION_TITLES[lang] || SECTION_TITLES['en'];
  const difficulties = DIFFICULTY[lang] || DIFFICULTY['en'];

  return docs
    .map((doc) =>
      `
# ${doc.question}

## ${titles['Quick Answer']}
${doc.answer}

## ${titles['Detailed Explanation']}
${doc.description}

## ${titles['Example Code']}
\`\`\`typescript
${doc.code}
\`\`\`

## ${titles['When to Use']}
${generateWhenToUse(doc.category, lang)}

## ${titles['Key Functions']}
${doc.related.map((f) => `- \`${f}\``).join('\n')}

## ${titles['Related Concepts']}
${doc.related.map((r) => `- [[${r}]]`).join('\n')}

## ${titles['Metadata']}
- **${titles['Tags']}:** ${doc.tags.join(', ')}
- **${titles['Difficulty']}:** ${difficulties[doc.difficulty] || doc.difficulty}
- **${titles['Module']}:** ${doc.module}
`.trim(),
    )
    .join('\n\n---\n\n');
}

function generateWhenToUse(category: string, lang: string = 'en'): string {
  const templates: Record<string, Record<string, string>> = {
    en: {
      constructors: 'When creating new Result values',
      guards: 'When checking Result type at runtime',
      methods: 'When transforming or chaining Result operations',
      patterns: 'When implementing common error handling patterns',
      async: 'When working with async operations and promises',
    },
    ru: {
      constructors: 'При создании новых значений Result',
      guards: 'При проверке типа Result во время выполнения',
      methods: 'При трансформации или связывании операций Result',
      patterns: 'При реализации распространённых паттернов обработки ошибок',
      async: 'При работе с асинхронными операциями и промисами',
    },
  };

  const langTemplates = templates[lang] || templates['en'];
  return langTemplates[category] || langTemplates['methods'];
}

function getAllExampleFiles(dir: string): string[] {
  const files: string[] = [];
  function walk(current: string) {
    const entries = readdirSync(current, { withFileTypes: true });
    for (const e of entries) {
      const path = `${current}/${e.name}`;
      if (e.isDirectory()) walk(path);
      else if (e.name === 'example.ts') files.push(path);
    }
  }
  walk(dir);
  return files;
}

function main(lang: string = 'en') {
  console.log(
    `🔄 Generating NotebookLM RAG documentation (${lang.toUpperCase()})...\n`,
  );

  const outputDir = lang === 'en' ? OUTPUT_BASE : `${OUTPUT_BASE}-${lang}`;
  mkdirSync(outputDir, { recursive: true });

  const files = getAllExampleFiles(EXAMPLES_DIR);
  console.log(`📁 Found ${files.length} example files\n`);

  const docs: RAGDoc[] = [];
  for (const file of files) {
    const doc = parseExampleFile(file, lang);
    if (doc) docs.push(doc);
  }

  console.log(`✅ Parsed ${docs.length} examples\n`);

  const grouped: Record<string, RAGDoc[]> = {};
  for (const doc of docs) {
    const categoryKey =
      CATEGORY_NAMES[doc.category.split('/')[0]]?.[lang] || doc.category;
    if (!grouped[categoryKey]) grouped[categoryKey] = [];
    grouped[categoryKey].push(doc);
  }

  for (const [fileKey, fileDocs] of Object.entries(grouped)) {
    const title = CATEGORY_TITLES[fileKey]?.[lang] || fileKey;
    const content = `# ${title}\n\n${formatForNotebookLM(fileDocs, lang)}`;

    const filename = lang === 'ru' ? `${fileKey}-ru.md` : `${fileKey}.md`;
    writeFileSync(`${outputDir}/${filename}`, content);
    console.log(`✅ Generated ${filename} (${fileDocs.length} docs)`);
  }

  console.log(
    `\n🎉 Generated ${Object.keys(grouped).length} files in ${outputDir}`,
  );
  console.log(`🌐 Language: ${lang.toUpperCase()}`);
}

const lang = process.argv[2] || 'en';
main(lang);
