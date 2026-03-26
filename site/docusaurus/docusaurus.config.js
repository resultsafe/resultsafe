// path: site/docusaurus/docusaurus.config.js
/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'ResultSafe Docs',
  tagline: 'Canonical docs + i18n publishing layer',
  url: 'https://example.com',
  baseUrl: '/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'ru'],
    localeConfigs: {
      en: { label: 'English' },
      ru: { label: 'Русский' },
    },
  },
  presets: [
    [
      'classic',
      {
        docs: {
          path: '../../docs',
          routeBasePath: '/',
          sidebarPath: require.resolve('./sidebars.js'),
          breadcrumbs: true,
          editUrl: ({ docPath, locale }) => {
            const repoBase = 'https://github.com/MY_ORG/MY_REPO'
            if (locale !== 'en') {
              return `${repoBase}/edit/main/site/docusaurus/i18n/${locale}/docusaurus-plugin-content-docs/current/${docPath}`
            }
            return `${repoBase}/edit/main/docs/${docPath}`
          },
        },
        blog: false,
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      },
    ],
  ],
  themeConfig: {
    navbar: {
      title: 'ResultSafe',
      items: [
        {
          type: 'localeDropdown',
          position: 'right',
        },
      ],
    },
  },
};

module.exports = config;
