// prettier.config.mjs
/** @type {import("prettier").Config} */
export default {
  printWidth: 80,
  tabWidth: 2,
  useTabs: false,
  semi: true,
  singleQuote: true,
  bracketSpacing: true,
  arrowParens: 'always',
  trailingComma: 'all',

  overrides: [
    {
      files: '*.json',
      options: { trailingComma: 'none' },
    },
    {
      files: '*.ts',
      options: { parser: 'typescript' },
    },
    {
      files: '*.tsx',
      options: { parser: 'typescript' },
    },
    {
      files: '*.{yml,yaml}',
      options: {
        tabWidth: 2,
        useTabs: false,
        singleQuote: false,
        trailingComma: 'none',
        proseWrap: 'preserve',
      },
    },
  ],
};
